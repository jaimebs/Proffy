import { Request, Response } from "express";
import db from "../database/connection";

import { convertHourToMinutes } from "../utils/convertHourToMinutes";

interface IScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

class classesController {
  async index(req: Request, res: Response) {
    const { week_day, subject, time } = req.query;

    if (!week_day || !subject || !time) {
      return res.status(400).json({ error: "Missing filters search classes!" });
    }

    const timeToMinutes = convertHourToMinutes(time as string);

    const classes = await db("classes")
      .whereExists(function () {
        this.select("class_schedule.*")
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [
            Number(week_day as string),
          ])
          .whereRaw("`class_schedule`.`from` <= ??", [timeToMinutes])
          .whereRaw("`class_schedule`.`to` > ??", [timeToMinutes]);
      })
      .where("classes.subject", "=", subject as string)
      .join("users", "classes.user_id", "=", "users.id")
      .select("classes.*", "users.*");

    res.status(200).json(classes);
  }

  async create(req: Request, res: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;

    const trx = await db.transaction();

    try {
      // No insert o knex sempre retorna um array de ids, então devemos pegar a primeira posição
      const [user_id] = await trx("users").insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      const [class_id] = await trx("classes").insert({
        subject,
        cost,
        user_id,
      });

      const scheduleList = schedule.map((scheduleItem: IScheduleItem) => ({
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
        class_id,
      }));

      await trx("class_schedule").insert(scheduleList);

      await trx.commit();

      return res.status(201).json({ message: "Class created!" });
    } catch (error) {
      await trx.rollback();

      return res
        .status(400)
        .json({ error: "Unexpected error while creating class" });
    }
  }
}

export default new classesController();
