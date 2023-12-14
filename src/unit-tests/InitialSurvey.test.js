import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InitialSurvey from '../pages/InitialSurvey';
import CoachSurvey from '../pages/CoachSurvey';
import userEvent from '@testing-library/user-event';

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

test('initial survey for client', async () => {
    const { getAllByText } = render(<InitialSurvey/>)

    expect(getAllByText("Date of Birth")[0]).toBeInTheDocument();
    expect(getAllByText("Gender")[0]).toBeInTheDocument();
    expect(getAllByText("Height (ft'in'')")[0]).toBeInTheDocument();
    expect(getAllByText("Weight (lbs)")[0]).toBeInTheDocument();
    expect(getAllByText("Weight Goal")[0]).toBeInTheDocument();
    expect(getAllByText("Submit")[0]).toBeInTheDocument();
});

test('initial survey for coach', async () => {
    const { getAllByText } = render(<CoachSurvey/>)

    expect(getAllByText("Experience (years)")[0]).toBeInTheDocument();
    expect(getAllByText("Specialization")[0]).toBeInTheDocument();
    expect(getAllByText("City")[0]).toBeInTheDocument();
    expect(getAllByText("State")[0]).toBeInTheDocument();
    expect(getAllByText("Price per Hour")[0]).toBeInTheDocument();
    expect(getAllByText("Submit")[0]).toBeInTheDocument();
});
