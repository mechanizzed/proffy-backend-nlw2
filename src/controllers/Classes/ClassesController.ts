import { Request, Response } from 'express';
import db from '../../database/connection';
import convertHourToMinutes from '../../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  // index
  async index(req: Request, res: Response) {
    const filters = req.query;

    if (!filters.week_day || !filters.subject || !filters.time) {
      return res.status(400).json({ error: 'Missing filters to search' });
    }

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)]);
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

    return res.json(classes);
  }

  // create
  async create(req: Request, res: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;

    const trx = await db.transaction();

    try {
      // insert new user
      const usersIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      // get id from inserted user
      const user_id = usersIds[0];

      // insert new classes
      const classesIds = await trx('classes').insert({
        subject,
        cost,
        user_id,
      });

      // get id from inserted classe
      const class_id = classesIds[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });

      // insert new class schedule
      await trx('class_schedule').insert(classSchedule);

      await trx.commit();
      return res.status(201).json({ message: true });
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({ error: error });
    }
  }
}
