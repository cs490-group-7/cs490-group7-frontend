import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Workouts from '../pages/Workouts';
import WorkoutAssignment from '../components/workout-components/WorkoutAssignment';
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
        useLocation: () => mockUsedLocation,
}));

test('Client can create a personalized workout plan', async () => {
    const { getByText, getByTitle, getAllByText } = render(<Workouts/>)

    const currentDate = new Date(); currentDate.setDate(currentDate.getDate());
    const formattedDate = currentDate.toLocaleDateString('en-us', { weekday: "long" }) +", "+ currentDate.toLocaleDateString('en-us', { month: "long", day: "numeric" });
    expect(getByText(formattedDate)).toBeInTheDocument();

    const createWorkout = getByTitle("createWorkoutBtn");
    userEvent.click(createWorkout)
    
    await waitFor(() => {
        expect(getByText("Workout Name")).toBeInTheDocument();
        expect(getByText("Set Count")).toBeInTheDocument();
        expect(getByText("Description")).toBeInTheDocument();
        expect(getByText("Exercise 1")).toBeInTheDocument();
        expect(getAllByText("Create Workout")[0]).toBeInTheDocument();
    });

});

test('Client can log their progress against the personalized workout plan', async () => {
    const { getByText } = render(<WorkoutAssignment loggable="true"/>)

    await waitFor(() => {
        expect(getByText("Log")).toBeInTheDocument();
        expect(getByText("Details")).toBeInTheDocument();
        expect(getByText("Unassign")).toBeInTheDocument();
    });
});

test('Client can view the last 5 days or last known workout plan and their logged progress against it (', async () => {
    const { getByText } = render(<MyProgress/>)

    expect(getByText("My Progress")).toBeInTheDocument();
    const workoutsBtn = getByText("Workouts");
    expect(workoutsBtn).toBeInTheDocument();
});
