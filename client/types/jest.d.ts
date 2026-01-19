import '@testing-library/jest-dom';
import { AxeMatchers } from 'jest-axe';

declare global {
    namespace jest {
        interface Matchers<R> extends AxeMatchers { }
    }
}
