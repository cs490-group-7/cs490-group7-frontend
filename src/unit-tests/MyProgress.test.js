import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyProgress from '../pages/MyProgress';
import axios from 'axios';

jest.mock('axios');
const mockUsedNavigate = jest.fn();
const mockUsedLocation = {
    state: {
        user_id: 1,
    }
};
const mockProgressData = [
    {
        "date": "2023-12-16T00:00:00.000Z",
        "weight": 152,
        "calorie_intake": 2500,
        "water_intake": 1500
    }
];
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockUsedNavigate,
        useLocation: () => mockUsedLocation
}));

test('Client can view daily survey progress', async () => {
    axios.post.mockResolvedValue({ data: mockProgressData });
    const { getByText } = render(<MyProgress/>)

    expect(getByText("My Progress")).toBeInTheDocument();
    expect(getByText("Weight")).toBeInTheDocument();
    expect(getByText("Calorie Intake")).toBeInTheDocument();
    expect(getByText("Water Intake")).toBeInTheDocument();
});