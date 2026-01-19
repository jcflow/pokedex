# Generative AI tools

## Directive
Imagine you’re tasked with generating a Table component for a simple task management
system using your preferred language. The system should support the following functionality:
● Create, read, update, and delete tasks (CRUD)
● Each task has a title, description, status, and due_date
● Tasks are associated with a user (assume basic User model exists)

## AI GenTool
Gemini 3 Pro

## Prompt
**Actor:** Full-Stack Engineer

**Context:**  I am working on a Full Stack application using  **Ruby on Rails 7 (API)**  for the backend and  **React + TypeScript + TailwindCSS**  for the frontend. A  `User`  model already exists (devise/auth logic implies a  `current_user`  helper is available).

**Goal:**  Implement a complete CRUD for a  `Task`  resource associated with users.

**Part 1: Backend (Ruby on Rails)**  Generate the code and Rails commands to implement the  `Task`  model, controller, and routes.

1.  **Model:**  `Task`  belongs to  `User`.
    
    -   Attributes:  `title`  (string, required),  `description`  (text, optional),  `status`  (integer/enum:  `todo`,  `in_progress`,  `done`, default:  `todo`),  `due_date`  (datetime, optional).
        
    -   Add standard Rails validations.
        
2.  **Controller:**  `TasksController`.
    
    -   Scoped to  `current_user.tasks`.
        
    -   Standard CRUD actions (index, create, update, destroy) returning JSON.
        
    -   **Important:**  Handle edge cases (resource not found, validation errors) and return appropriate HTTP status codes (404, 422).

3. **Routes:** `config/routes.rb entry`.

**Part 2: Frontend (React + TS)**  Create a functional component named  `TaskTable`.

-   **UI:**  A clean table using TailwindCSS.
    
-   **State Management:**  Store tasks locally but sync via  `fetch`.
    
-   **Features:**
    
    1.  **Create:**  A "New Task" button that optimistically adds a row with title "Untitled" and calls the create endpoint.
        
    2.  **Read:**  Fetch tasks on mount.
        
    3.  **Update:**  Make the table cells inputs. Implement a  **debounce pattern**  (500ms) on change to trigger the  `PATCH`  endpoint automatically (auto-save). Ensure date inputs handle strings correctly.
        
    4.  **Delete:**  A delete button per row that removes the item from UI and calls the API.

**Desired Result Format:** Rails terminal commands, the Model/Controller/Routes code, and the full React component code.

## Response
### 1. Rails Terminal Commands

Bash

```
# Generate the Model
rails generate model Task title:string description:text status:integer due_date:datetime user:references

# Run migration
rails db:migrate

# Generate the Controller
rails generate controller Tasks

```

### 2. Backend Code (Ruby on Rails)

**Model:  `app/models/task.rb`**

Ruby

```
class Task < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :status, presence: true

  enum status: { todo: 0, in_progress: 1, done: 2 }, _default: :todo
end

```

**Controller:  `app/controllers/tasks_controller.rb`**

Ruby

```
class TasksController < ApplicationController
  # Assuming Devise or similar auth that provides current_user
  before_action :authenticate_user!
  before_action :set_task, only: %i[update destroy]

  # GET /tasks
  def index
    @tasks = current_user.tasks.order(created_at: :desc)
    render json: @tasks
  end

  # POST /tasks
  def create
    @task = current_user.tasks.build(task_params)

    if @task.save
      render json: @task, status: :created
    else
      render json: { errors: @task.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tasks/:id
  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: { errors: @task.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /tasks/:id
  def destroy
    @task.destroy
    head :no_content
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Task not found" }, status: :not_found
  end

  def task_params
    params.require(:task).permit(:title, :description, :status, :due_date)
  end
end

```

**Routes:  `config/routes.rb`**

Ruby

```
Rails.application.routes.draw do
  resources :tasks, only: [:index, :create, :update, :destroy]
end

```

### 3. Frontend Code (React + TypeScript + Tailwind)

**Component:  `TaskTable.tsx`**

TypeScript

```
import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Types ---
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string | null;
}

// --- Helper: Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- API Helpers ---
  // Ideally, these would be in a separate service file
  const fetchTasks = async () => {
    try {
      const response = await fetch('/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    // Optimistic UI update
    const tempId = Date.now();
    const optimisticTask: Task = {
      id: tempId,
      title: 'Untitled',
      description: '',
      status: 'todo',
      due_date: null,
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { title: 'Untitled' } }),
      });

      if (!response.ok) throw new Error('Creation failed');
      
      const savedTask = await response.json();
      // Replace optimistic task with real one
      setTasks((prev) => prev.map((t) => (t.id === tempId ? savedTask : t)));
    } catch (err) {
      console.error(err);
      // Revert on failure
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      alert('Failed to create task');
    }
  };

  const updateTask = async (id: number, payload: Partial<Task>) => {
    try {
      const response = await fetch(`/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: payload }),
      });
      if (!response.ok) throw new Error('Update failed');
    } catch (err) {
      console.error(err);
      // Optionally handle revert logic here
    }
  };

  const deleteTask = async (id: number) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
    } catch (err) {
      console.error(err);
      setTasks(previousTasks); // Revert
      alert('Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div className="p-4">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={createTask}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          New Task
        </button>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                onUpdate={updateTask} 
                onDelete={deleteTask} 
              />
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No tasks found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Sub-component for Row Logic & Debouncing ---
interface TaskRowProps {
  task: Task;
  onUpdate: (id: number, payload: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onUpdate, onDelete }) => {
  const [localTask, setLocalTask] = useState(task);
  
  // Track if it's the initial render to avoid firing update on mount
  const isMounted = useRef(false);

  // Sync state if parent updates (e.g. optimistic ID replacement)
  useEffect(() => {
    setLocalTask(task);
  }, [task.id, task.updated_at]); // Ideally use a timestamp or verify ID change

  // Debounce the entire localTask object
  const debouncedTask = useDebounce(localTask, 500);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // Compare values to prevent unnecessary requests or loops
    const hasChanged = 
      debouncedTask.title !== task.title ||
      debouncedTask.description !== task.description ||
      debouncedTask.status !== task.status ||
      debouncedTask.due_date !== task.due_date;

    if (hasChanged) {
      onUpdate(task.id, {
        title: debouncedTask.title,
        description: debouncedTask.description,
        status: debouncedTask.status,
        due_date: debouncedTask.due_date
      });
    }
  }, [debouncedTask, task, onUpdate]);

  const handleChange = (field: keyof Task, value: any) => {
    setLocalTask((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-6 py-4">
        <input
          type="text"
          value={localTask.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          value={localTask.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
          placeholder="Add description..."
        />
      </td>
      <td className="px-6 py-4">
        <select
          value={localTask.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <input
          type="datetime-local"
          value={localTask.due_date ? localTask.due_date.slice(0, 16) : ''}
          onChange={(e) => handleChange('due_date', e.target.value)}
          className="w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1"
        />
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onDelete(task.id)}
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TaskTable;
```

## Critical Thinking

### 1. Validated the AI's suggestions

Upon reviewing the generated code, my first task was to look the "happy path" that AI tools tend to prioritize.

-   **State Management & Race Conditions:**  The AI suggested a  `useEffect`  inside every row (`TaskRow`) to handle auto-save via debouncing. I flagged this as dangerous. If a user types quickly and switches rows, or if API responses return out of order, we risk data inconsistency or overwriting updates.
    
-   **Date & Timezone Handling:**  I validated the usage of the  `datetime-local`  input. The AI simply sliced the string (`slice(0, 16)`). This is an immediate red flag. Without a library like  `moment.js`, and without explicitly normalizing to UTC before sending data to the backend, users in different time zones will see incorrect dates. The AI’s code assumes the browser and server are magically aligned.
    

### 2. Corrected or improved the output

The delivered code required refactoring to meet maintainability and accessibility standards.

-   **Service Layer Abstraction:**  I'd extract all  `fetch`  calls from the component into a dedicated service file or a custom hook (`useTasks`). Mixing network logic with UI logic hampers unit testing and reusability.
    
-   **Table Accessibility (A11y):**  The AI generated inputs without associated labels. to a screen reader, this results in a table full of generic text fields without context. I'd correct this by adding  `aria-label`  to the inputs. I'd also improve the color contrast suggested by Tailwind and ensure logical keyboard focus navigation between cells.
    
-   **Eliminating Unnecessary Rerenders:**  The  `TaskRow`  component was manually comparing every property (`debouncedTask.title !== task.title`, etc.) inside a  `useEffect`. I'd replace this by using  `React.memo`  on the row component and moving the comparison logic, which simplifies cognitive complexity and reduces the risk of infinite render loops.
    

### 3. Handled edge cases, authentication, or validations

-   **Silent Errors & User Feedback:**  The AI relied on  `console.error`  if the auto-save failed. This is a bad UX. I implemented visual status indicators on every row (e.g., "Saving...", "Saved", "Error: Retry") and a toast system for critical errors. If model validation fails (e.g., empty title), the user should see a red border on the specific input, not a generic  `alert`.
    
-   **Session Expiration:**  A critical edge case is the user's session expiring while they are editing cells. The AI's code didn't handle this. I'd add logic to detect these errors, pause auto-save requests, and redirect to login (or show a re-auth modal) without losing the data the user currently has in their local state.
    
-   **Security in Strong Parameters:**  Although the AI used  `task_params`, I double-checked that the controller didn't allow mass injection of unwanted parameters, specifically  `user_id`. I ensured creation was strictly scoped to  `current_user.tasks.build`, preventing malicious actors from creating tasks for other users by manipulating the ID in the payload.
    

### 4. Assessed the performance and idiomatic quality of the code

-   **N+1 & Rendering Performance:**  If the task list grows to 100 or 200 items, having 200 event listeners and 200 active debounce timers simultaneously will degrade browser performance. I'd change the UX to a "click-to-edit" pattern, drastically reducing the number of active event listeners.
    
-   **Idiomatic Rails Usage:**  The AI used  `render json: @task.errors`. While valid, a more idiomatic and standardized approach for modern APIs is to use a serializer (like `jsonapi-serializer`) to ensure the JSON structure is consistent and evolvable, rather than dumping the raw ActiveRecord object.

-   **Data Fetching Strategy:**  The  `fetch-on-mount`  pattern (empty  `useEffect`) is prone to race conditions if the component unmounts before the request finishes. I'd use  **React Query**. This provides caching, automatic retries on network failure, and smart cache invalidation after mutations (create/delete) out of the box, eliminating the need to manually manage  `loading`  and  `error`  states.