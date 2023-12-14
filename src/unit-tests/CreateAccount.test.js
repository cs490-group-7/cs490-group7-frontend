import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateAccountPage from '../pages/CreateAccountPage';
import userEvent from '@testing-library/user-event';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('visitor can register as a client', async () => {
    const { getByText, getByTitle, getAllByText } = render(<CreateAccountPage/>)

    expect(getByText("First Name")).toBeInTheDocument();
    expect(getByText("Last Name")).toBeInTheDocument();
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText("Password")).toBeInTheDocument();
    expect(getByText("Confirm Password")).toBeInTheDocument();
    expect(getByText("Phone Number")).toBeInTheDocument();
    expect(getAllByText("Create Account")[0]).toBeInTheDocument();

    const userType = getByTitle('user-type').childNodes[1].childNodes[0];
    expect(userType).toHaveTextContent('Client');
});

test('Visitor can request to sign up as a Fitness Instructor (Coach)', async () => {
    const { getByText, getByTitle, getAllByText } = render(<CreateAccountPage/>)

    expect(getByText("First Name")).toBeInTheDocument();
    expect(getByText("Last Name")).toBeInTheDocument();
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText("Password")).toBeInTheDocument();
    expect(getByText("Confirm Password")).toBeInTheDocument();
    expect(getByText("Phone Number")).toBeInTheDocument();
    expect(getAllByText("Create Account")[0]).toBeInTheDocument();

    const userType = getByTitle('user-type').childNodes[1].childNodes[1];
    //check if isCoach value is false
    expect(userType).toHaveProperty('value', 'false');
});

