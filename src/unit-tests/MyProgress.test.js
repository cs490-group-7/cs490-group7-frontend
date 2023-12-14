import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyProgress from '../pages/MyProgress'

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

test('Client can view graphed result of their surveys', async () => {
    const { getByText } = render(<MyProgress/>)

    expect(getByText("My Progress")).toBeInTheDocument();
    expect(getByText("Weight")).toBeInTheDocument();
    expect(getByText("Calorie Intake")).toBeInTheDocument();
    expect(getByText("Water Intake")).toBeInTheDocument();
    //fix later 
    // expect(getByText("No Data")).toBeInTheDocument();
    // expect(getByText("CanvasJS.com")).toBeInTheDocument();
});