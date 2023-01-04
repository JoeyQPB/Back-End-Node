import { Appointment } from "../entities/appointment";
import { AppointmentsRepository } from "../repositories/in-memory/appointments-repository";

interface CreateAppointmentRequest {
  customer: string;
  startsAt: Date;
  endsAt: Date;
}

type CreateAppointmentResponse = Appointment;

export class CreateAppointment {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    customer,
    startsAt,
    endsAt,
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const overLappingAppointment =
      await this.appointmentsRepository.findOverlappingAppointment(
        startsAt,
        endsAt
      );

    if (overLappingAppointment) {
      throw new Error("Anathor appoint overlaps this appointment dates");
    }
    const appointment = new Appointment({ customer, startsAt, endsAt });

    await this.appointmentsRepository.create(appointment);

    return appointment;
  }
}
