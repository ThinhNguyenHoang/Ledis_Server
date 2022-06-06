/**
 * Implementing the Command Pattern for ease of code mangement
 * Link: https://refactoring.guru/design-patterns/command
 */
export interface Command {
    execute(): any;
}

export function isCommand(obj: any): obj is Command {
    return (obj as Command).execute !== undefined;
}

