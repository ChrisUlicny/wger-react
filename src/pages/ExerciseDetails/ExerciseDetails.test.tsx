import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ExerciseDetails } from './index';
import { Routes, Route, MemoryRouter } from 'react-router';
import { Category } from 'components/Exercises/models/category';
import { Language } from 'components/Exercises/models/language';
import { Muscle } from 'components/Exercises/models/muscle';
import { Equipment } from 'components/Exercises/models/equipment';
import { ExerciseBase } from 'components/Exercises/models/exerciseBase';
import { ExerciseTranslation } from 'components/Exercises/models/exerciseTranslation';
import { getExerciseBase, getExerciseBases, getLanguages } from "services";

// jest changes all exports in this module to jest.fn() so that when we call
//  one of this fxns like getExerciseBase, it calls the jest.fn() that was assigned to it
jest.mock("services");

describe("Should render with", () => {
    const categories = [
        new Category(1, 'Arms'),
        new Category(2, 'Legs'),
        new Category(3, 'Chest')
    ];
    const languages = [
        new Language(1, 'de', 'Deutsch'),
        new Language(2, 'en', 'English')
    ];
    const muscles = [
        new Muscle(1, 'Big muscle', true),
        new Muscle(2, 'Finger muscle', true),
        new Muscle(3, 'Deltoid', false),
        new Muscle(4, 'Abs', true),
    ];
    const equipment = [
        new Equipment(1, 'Barbell'),
        new Equipment(2, 'Dumbbell'),
        new Equipment(10, "Kettlebell"),
        new Equipment(42, "Rocks"),
    ];
    
    const exerciseBase = new ExerciseBase(
        345,
        "c788d643-150a-4ac7-97ef-84643c6419bf",
        categories[1],
        [equipment[0], equipment[3]],
        [muscles[0], muscles[3]],
        [],
        [],
        [],
        [],
        [
            new ExerciseTranslation(111,
                '583281c7-2362-48e7-95d5-8fd6c455e0fb',
                'Squats',
                'Do a squat',
                2
            ),
            new ExerciseTranslation(9,
                'dae6f6ed-9408-4e62-a59a-1a33f4e8ab36',
                'Kniebeuge',
                'Kniebeuge machen',
                1
            )
        ]
    );

    beforeEach(() => {
        // since we used jest.mock(), getExerciseBase is a jest.fn() having no implementation
        // or doing nothing at all, so this implementation will resolve to our dummy data.
        // @ts-ignore
        getExerciseBase.mockImplementation(() => Promise.resolve( exerciseBase ));
        // @ts-ignore
        getExerciseBases.mockImplementation(() => Promise.resolve([
                exerciseBase,
                exerciseBase,
                exerciseBase,
        ]));
        // @ts-ignore
        getLanguages.mockImplementation(() => Promise.resolve(languages));
    });
    
    test('should render the exercise to screen', async () => {
        
        render(<MemoryRouter initialEntries={['/exercises/9']}>
                    <Routes>
                        <Route path='exercises/:exerciseID' element={<ExerciseDetails />} />
                    </Routes>
                </MemoryRouter>);
        
        await act(() => Promise.resolve());

        expect(getExerciseBase).toBeCalledTimes(1);
        expect(getLanguages).toBeCalled();
        expect(getExerciseBases).toBeCalled();
    
        await waitFor(() => {
            expect(screen.getByText("Squats")).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(exerciseBase.muscles[0].name)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(exerciseBase.muscles[0].name)).toBeInTheDocument();
        });
        expect(screen.getByText('Starting position')).toBeInTheDocument();
        expect(screen.getByText('Variants')).toBeInTheDocument();

        expect(screen.getByText("VIEW")).toBeInTheDocument();
        
     });
});