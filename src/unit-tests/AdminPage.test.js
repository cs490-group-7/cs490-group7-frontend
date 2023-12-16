import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from '../pages/AdminPage';
import axios from 'axios';

jest.mock('axios');
const mockUsedNavigate = jest.fn();
const mockUsedLocation = {
    state: {
        user_id: 1,
    }
};
const mockExerciseBank = 
    [
        {
            "exercise_id": 1,
            "exercise_name": "Bar Dip",
            "url": null,
            "exercise_type": "Chest",
            "last_update": "2023-12-14T04:05:38.000Z"
        },
        {
            "exercise_id": 2,
            "exercise_name": "Bench Press",
            "url": null,
            "exercise_type": "Chest",
            "last_update": "2023-12-14T04:05:38.000Z"
        },
    ];
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockUsedNavigate,
        useLocation: () => mockUsedLocation
}));

test('Admin can add or delete exercises from the master exercise bank', async () => {
    axios.get.mockResolvedValue({ data: mockExerciseBank });
    const { getAllByText, getByText } = render(<AdminPage/>)

    expect(getAllByText("Exercise Bank")[0]).toBeInTheDocument();
    expect(getAllByText("Exercise Name")[0]).toBeInTheDocument();
    expect(getAllByText("Add Exercise")[0]).toBeInTheDocument();
    
    await waitFor(() => {
        expect(getByText(mockExerciseBank[0].exercise_name)).toBeInTheDocument();
        expect(getByText(mockExerciseBank[1].exercise_name)).toBeInTheDocument();
        expect(getAllByText("Delete")[0]).toBeInTheDocument();
    });

});

test('Admin can approve or reject Coach Requests', async () => {
    axios.get.mockResolvedValue({ data: mockExerciseBank });
    const { getAllByText, getByText } = render(<AdminPage/>)

    expect(getByText("Coach Approvals")).toBeInTheDocument();
    await waitFor(() => {
        expect(getAllByText("Approve")[0]).toBeInTheDocument();
        expect(getAllByText("Reject")[0]).toBeInTheDocument();
    });
});