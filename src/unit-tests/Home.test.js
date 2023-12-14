import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/Home';
import userEvent from '@testing-library/user-event';

test('visitor can view landing page & interact with exercise bank', async () => {
    const { getByText, getByTitle } = render(<Home/>)
   
    expect(getByText("Welcome to TrackMeet!")).toBeInTheDocument();
    expect(getByText("Master over 200 Exercises:")).toBeInTheDocument();
    expect(getByText("Target a specific muscle group:")).toBeInTheDocument();
    
    const filterDropdown = getByTitle('exercise-filter').childNodes[1];
    expect(filterDropdown).toBeInTheDocument()
});

test('able to view list of all exercises', async () => {
    const { getByText } = render(<Home/>)
    await waitFor(() => {
        expect(getByText("Bar Dip")).toBeInTheDocument();
        expect(getByText("Bench Press")).toBeInTheDocument();
    });

    const nextPage = getByText('Next Page');
    userEvent.click(nextPage);
    await waitFor(() => {
        expect(getByText("Dumbbell Chest Fly")).toBeInTheDocument();
        expect(getByText("Dumbbell Decline Chest Press")).toBeInTheDocument();
    });
});

test('able to filter based on muscle group/equipment', async () => {
    const { getByText, getByTitle } = render(<Home/>)

    const filterDropdown = getByTitle('exercise-filter').childNodes[1];
    fireEvent.change(filterDropdown, { target: { value: 'Shoulder' } });

    await waitFor(() => {
        expect(getByText("Band External Shoulder Rotation")).toBeInTheDocument();
        expect(getByText("Band Internal Shoulder Rotation")).toBeInTheDocument();
    });
});