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

test('Initial Survey for both Client & Coach', async () => {
    const initialSurvey = render(<InitialSurvey/>)
    expect(initialSurvey.getAllByText("Date of Birth")[0]).toBeInTheDocument();
    expect(initialSurvey.getAllByText("Gender")[0]).toBeInTheDocument();
    expect(initialSurvey.getAllByText("Height (ft'in'')")[0]).toBeInTheDocument();
    expect(initialSurvey.getAllByText("Weight (lbs)")[0]).toBeInTheDocument();
    expect(initialSurvey.getAllByText("Weight Goal")[0]).toBeInTheDocument();
    expect(initialSurvey.getAllByText("Submit")[0]).toBeInTheDocument();

    const coachSurvey = render(<CoachSurvey/>)
    expect(coachSurvey.getAllByText("Experience (years)")[0]).toBeInTheDocument();
    expect(coachSurvey.getAllByText("Specialization")[0]).toBeInTheDocument();
    expect(coachSurvey.getAllByText("City")[0]).toBeInTheDocument();
    expect(coachSurvey.getAllByText("State")[0]).toBeInTheDocument();
    expect(coachSurvey.getAllByText("Price per Hour")[0]).toBeInTheDocument();
    expect(coachSurvey.getAllByText("Submit")[0]).toBeInTheDocument();
});
