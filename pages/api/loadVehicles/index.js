import axios from "axios";
import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  console.log('Se ejecuto api/loadVehicles ');
  let start = Date.now();

  if (req.method === "GET") {
    let page = 1;

    try {
      const responseToken = await axios({
        method: "POST",
        url: `https://api.pilotsolution.net/v1/users/auth.php`,
        params: { username: "jsalcedo@autocor.com.ec", password: "12345" },
      });

      let tokenNew = responseToken.data.result.entitydata;
      if (!tokenNew) {
        console.log("Couldn't get the token");
        return res.status(404).end();
      }

      const data = [];
      let leftRemaining = 0;

      do {
        const response = await axios({
          method: "POST",
          url: `https://api.pilotsolution.net/v1/stock/list.php`,
          data: {
            data: {
              filters: [
                {
                  field: "availability_status_code",
                  operation: "=",
                  value: "1",
                },
              ],
              sort: [
                {
                  field: "created",
                  order: "DESC",
                },
              ],
              show_media: true,
              limit: 100,
              page: page,
            },
            header: {
              FlowName: "stock_images_list",
              SequenceId: 1,
              TimeStamp: 1248377,
              TrackingId: "55A6BCD4-0857-4A86-85FB-09A228B641B4",
              access_token: tokenNew,
            },
          },
        });

        leftRemaining = response.data.result.aditional_data.rows_remaining;
        page++;

        response.data.result.entitydata.forEach((item) =>
          data.push({
            id: item.id,
            media:
              item.media.length > 0
                ? item.media.filter((photo) => photo.size === "desktop")[0]
                    .full_path
                : null,
            brand: item.brand,
            model: item.model,
            prices: Number(item.prices[0].value) + 0,
            purchase_price: Number(item.prices[1].value) + 0,
            year: Number(item.year) || 0,
            owner: item.factory.status.toUpperCase() === "SI" ? 1 : 0,
            home: item.factory.request_number.toUpperCase() === "SI" ? 1 : 0,
            type: item.saving_plan.saving_plan_group.toUpperCase(),
            odometer: Number(item.odometer) + 0,
            business_channel: item.business_channel,
            integration_reference_code: item.integration_reference_code,
            version: item.version,
            location: item.owner_branch_code?.name || "No disponible",
            color: item.color,
            accesories: item.accesories,
            license_plate: item.license_plate,
            received_flag: item.received_flag.toString(),
            days_in_stock:  item.days_in_stock.toString(),
            published_in_web: item.published_in_web,
            engine_number: item.engine_number,
            reserved_by_user_email: item.reservation.reserved_by_user?.name || '',
            reserved_by_user_name:  item.reservation.reserved_by_user?.fullname || '',
            reserved_dt: item.reserved_dt,
            expiration_dt: item.expiration_dt,
            opportunity_sale_id: item.opportunity_sale?.id || '',
            factory_invoicing_dt: item.factory?.invoicing_dt ? new Date(item.factory.invoicing_dt) : null,
            factory_status: item.factory?.status || '',
            status_name: item.status?.name || '',
            fuel_name: item.fuel?.name || '',
            availability_status_name: item.availability_status?.name || '',
            availability_status_code: item.availability_status?.code || '',
            created_fullname: item.created.user.fullname,
            created_dt: item.created?.dt ? new Date(item.created.dt) : null,
            deleted_flag: item.deleted.flag,
            owner_branch_code: item.owner_branch_code?.name || '',
            saving_plan_group: item.saving_plan?.saving_plan_group || '',
            saving_plan_order: item.saving_plan?.saving_plan_order || '',
          })
        );
      } while (leftRemaining > 0);

      if (data.length === 0) {
        console.log("Couldn't fetch Pilot data");
        return res.status(404).end();
      }

      const clean = await db.$executeRawUnsafe(`TRUNCATE Vehicle`);
      if (clean === 0) {
        const responseLoad = await db.vehicle.createMany({
          data,
        });
      } else {
        console.log("Couldn't clean the table");
        return res.status(404).end();
      }

      let timeTaken = Date.now() - start;
      return res
        .status(200)
        .json(`Data loaded | ${data.length} records | Time ${timeTaken}ms`);
    } catch (err) {
      console.log(err);
      console.log("Couldn't get Pilot data");
      return res.status(404).end();
    }
  }

  console.log("Wrong API call");
  return res.status(404).end();
}

export default handler;
