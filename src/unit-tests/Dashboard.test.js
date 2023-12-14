import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../pages/Dashboard'

const mockUsedNavigate = jest.fn();
const mockUsedLocation = {
    state: {
        user_id: 1,
    }
};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockUsedNavigate,
        useLocation: () => mockUsedLocation
}));

test('Client can take the daily surveys (3 categories)', async () => {
    const { getByText } = render(<Dashboard/>)

    expect(getByText("Daily Check-in")).toBeInTheDocument();
    expect(getByText("Calories Consumed")).toBeInTheDocument();
    expect(getByText("Water Intake (in mL)")).toBeInTheDocument();
    expect(getByText("Weight")).toBeInTheDocument();
    expect(getByText("Submit Check-in")).toBeInTheDocument();
});