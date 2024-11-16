import React from "react";
import { FixedSizeGrid as Grid } from "react-window"; // Use FixedSizeGrid for uniform-sized items
import { OverviewCard } from "components/Exercises/Detail/OverviewCard";
import { Exercise } from "components/Exercises/models/exercise";
import { Language } from "components/Exercises/models/language";
import { useLanguageQuery } from "components/Exercises/queries";
import { useTranslation } from "react-i18next";
import { getLanguageByShortName } from "services";

type ExerciseGridProps = {
    exercises: Exercise[];
};

export const ExerciseGrid = ({ exercises }: ExerciseGridProps) => {

    const languageQuery = useLanguageQuery();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [t, i18n] = useTranslation();
    
    let currentUserLanguage: Language | undefined;
    if (languageQuery.isSuccess) {
        currentUserLanguage = getLanguageByShortName(i18n.language, languageQuery.data);
    }
    const cardWidth = 250;  
    const cardHeight = 250; 

    const Row = ({ columnIndex, rowIndex, style }: any) => {
        const exerciseIndex = rowIndex * 3 + columnIndex; /
        const exercise = exercises[exerciseIndex];

        if (!exercise) return null;

        return (
            <div style={style}>
                <OverviewCard exercise={exercise} language={currentUserLanguage} />
            </div>
        );
    };

    return (
        <Grid
            columnCount={3} 
            columnWidth={cardWidth}
            height={600} 
            rowCount={Math.ceil(exercises.length / 3)} 
            rowHeight={cardHeight}
            width={750}
        >
            {Row}
        </Grid>
    );
};