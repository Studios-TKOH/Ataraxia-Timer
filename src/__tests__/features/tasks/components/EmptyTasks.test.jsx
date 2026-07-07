import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyTasks from '@/features/tasks/components/EmptyTasks';

describe('EmptyTasks', () => {
    it('renders the empty tasks state correctly', () => {
        render(<EmptyTasks />);
        
        expect(screen.getByText('Zen State')).toBeInTheDocument();
        expect(screen.getByText(/There are no pending missions/i)).toBeInTheDocument();
    });
});
