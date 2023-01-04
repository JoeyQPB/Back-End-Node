import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { CreateAppointment } from "./create-appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";

describe("Create Appointment", () => {
  it("Should be able to create an appointment", () => {
    const startsAt = getFutureDate("2023-08-10");
    const endsAt = getFutureDate("2023-08-11");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const sut = new CreateAppointment(appointmentsRepository);
    //system under test

    expect(
      sut.execute({
        customer: "Jhon Doe",
        startsAt,
        endsAt,
      })
    ).resolves.toBeInstanceOf(Appointment);
  });

  it("Should not be able to create an appointment with overlapping dates", async () => {
    const startsAt = getFutureDate("2023-08-10");
    const endsAt = getFutureDate("2023-08-15");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const sut = new CreateAppointment(appointmentsRepository);
    //system under test

    await sut.execute({
      customer: "Jhon Doe",
      startsAt,
      endsAt,
    });

    expect(
      sut.execute({
        customer: "Jhon Doe",
        startsAt: getFutureDate("2023-08-14"),
        endsAt: getFutureDate("2023-08-18"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      sut.execute({
        customer: "Jhon Doe",
        startsAt: getFutureDate("2023-08-08"),
        endsAt: getFutureDate("2023-08-12"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      sut.execute({
        customer: "Jhon Doe",
        startsAt: getFutureDate("2023-08-08"),
        endsAt: getFutureDate("2023-08-17"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      sut.execute({
        customer: "Jhon Doe",
        startsAt: getFutureDate("2023-08-11"),
        endsAt: getFutureDate("2023-08-12"),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
