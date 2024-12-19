import { Command } from './command';

/** Encapsulates internal state for domain model */
export abstract class Model<T> {
  protected _state: T;

  private _commands: Command<unknown>[] = [];

  constructor(data: T) {
    this._state = { ...data };
  }

  public exposeCommands(): Iterable<Command<unknown>> {
    const commands = [...this._commands.values()];
    this._commands = [];

    return commands;
  }

  public toDTO(): T {
    return { ...this._state };
  }

  protected addCommand(command: Command<unknown>): void {
    this._commands.push(command);
  }

  protected addCommands(commands: Iterable<Command<unknown>>): void {
    for (const command of commands) {
      this.addCommand(command);
    }
  }
}
