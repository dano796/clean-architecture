import { GetUsers } from "../../application/use-cases/GetUsers";
import { GetUsersPresenter } from "../presenters/GetUsersPresenter";

export class GetUsersController {
  constructor(
    private readonly useCase: GetUsers,
    private readonly presenter: GetUsersPresenter,
  ) {}

  async handle(): Promise<void> {
    const output = await this.useCase.execute();
    console.log(this.presenter.format(output));
  }
}
