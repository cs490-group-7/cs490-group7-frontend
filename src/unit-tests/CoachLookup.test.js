import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoachLookup from '../pages/CoachLookup';
import axios from 'axios';

jest.mock('axios');
const mockUsedNavigate = jest.fn();
const mockUsedLocation = {
    state: {
        user_id: 1,
    }
};
const mockCoaches = 
    [
        {
            "id":1,
            "first_name":"Coach",
            "last_name":"One"
        },
        {
            "id":2,
            "first_name":"Coach",
            "last_name":"Two"
        },
    ];
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockUsedNavigate,
        useLocation: () => mockUsedLocation
}));

test('Client can filter through Coaches based on specialization/price/location', async () => {
    axios.post.mockResolvedValue({ data: mockCoaches });
    const { getAllByText } = render(<CoachLookup/>)

    expect(getAllByText("Filter:")[0]).toBeInTheDocument();
    expect(getAllByText("Min Experience (years)")[0]).toBeInTheDocument();
    expect(getAllByText("Specializations")[0]).toBeInTheDocument();
    expect(getAllByText("City")[0]).toBeInTheDocument();
    expect(getAllByText("State")[0]).toBeInTheDocument();
    expect(getAllByText("Max Price")[0]).toBeInTheDocument();
});

test('Client can view list of Coaches', async () => {
    axios.post.mockResolvedValue({ data: mockCoaches });
    const { getByText } = render(<CoachLookup/>)

    await waitFor(() => {
        expect(getByText(mockCoaches[0].first_name +" "+ mockCoaches[0].last_name)).toBeInTheDocument();
        expect(getByText(mockCoaches[1].first_name +" "+ mockCoaches[1].last_name)).toBeInTheDocument();
    });
});