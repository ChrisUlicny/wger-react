import { WorkoutSetting } from "components/WorkoutRoutines/models/WorkoutSetting";
import { REP_UNIT_REPETITIONS, REP_UNIT_TILL_FAILURE } from "utils/consts";


/*
 * Converts a list of workout settings into a human-readable string like "3 × 5"
 */
export function settingsToText(sets: number, settingsList: WorkoutSetting[]) {

    // TODO: translate "RiR"
    const getRir = (setting: WorkoutSetting) => setting.rir
        ? `${setting.rir} RiR`
        : "";

    const getReps = (setting: WorkoutSetting) => {
        if (setting.repetitionUnit === REP_UNIT_TILL_FAILURE) {
            return "∞";
        }

        const repUnit = setting.repetitionUnit !== REP_UNIT_REPETITIONS
            ? _(setting.repetitionUnitObj!.name)
            : '';

        return `${setting.reps} ${repUnit}`;
    };

    // TODO: actually translate the names
    const _ = (str: string) => {
        return str;
    };

    const normalizeWeight = (weight: number | null) => {
        if (weight === null) {
            return '';
        } else if (Number.isInteger(weight)) {
            return weight.toString();
        } else {
            return weight.toFixed(2).toString();
        }
    };

    const getSettingText = (currentSetting: WorkoutSetting, multi: boolean = false) => {
        const reps = getReps(currentSetting);
        const weightUnit = currentSetting.weightUnitObj!.name;
        const weight = normalizeWeight(currentSetting.weight);
        const rir = getRir(currentSetting);

        let out = multi ? reps : `${sets} × ${reps}`.trim();

        if (weight) {
            const rirText = rir ? `, ${rir}` : "";
            out += ` (${weight} ${weightUnit}${rirText})`;
        } else {
            out += rir ? ` (${rir})` : "";
        }

        return out;
    };

    if (settingsList.length === 1) {
        return getSettingText(settingsList[0]);
    } else {
        return settingsList.map((setting) => getSettingText(setting, true)).join(" – ");
    }
}