export class GameLogic {
  public dummy(): string {
    return (
      "This date is from the shared lib! Date when calling gamelogic: " +
      new Date().toDateString()
    );
  }
}
