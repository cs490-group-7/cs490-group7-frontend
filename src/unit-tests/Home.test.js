import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/Home';
import userEvent from '@testing-library/user-event';

test('successful unit test sample', () => {
});

test('visitor can view landing page & interact with exercise bank', async () => {
    const { getByText, getByTitle } = render(<Home/>)
    await waitFor(() => {
        expect(getByText("Bar Dip")).toBeInTheDocument();
        expect(getByText("Bench Press")).toBeInTheDocument();
    });

    const nextPage = getByText('Next Page');
    userEvent.click(nextPage);
    
    await waitFor(() => {
        expect(screen.getByText("Dumbbell Chest Fly")).toBeInTheDocument();
        expect(screen.getByText("Dumbbell Decline Chest Press")).toBeInTheDocument();
    });
});
