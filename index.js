import express from "express";
const app = express();

app.use(express.json());

//room
const rooms = [
  {
    name: "superdeluxe",
    seats: 100,
    amenities: "Ac,Projector,Wi-Fi",
    price: 5000,
    room_id: "10050001",
    bookingDetails: [
      {
        customer_name: "Satya",
        date: "10/01/2022",
        start: "10:00",
        end: "12:00",
        status: "Confirmed",
      },
    ],
  },
  {
    name: "Premium",
    seats: 150,
    amenities: "Ac,Projector,Wi-Fi",
    price: 7500,
    room_id: "15075002",
    bookingDetails: [
      {
        customer_name: "rahul",
        date: "11/01/2022",
        start: "11:00",
        end: "13.00",
        status: "Payment Pending",
      },
    ],
  },
];

//common call api status
app.get("/", (req, res) => {
  res.status(200).send("Server is running successfully ");
});

//create room
app.post("/create-room", (req, res) => {
  rooms.push({
    name: req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
    room_id: `${req.body.seats}${req.body.price}${rooms.length + 1}`,
    bookingDetails: [{}],
  });
  res.send(rooms);
});

//Book rooms
app.post("/book-room", (req, res) => {
  for (let i = 0; i < rooms.length; i++) {
    console.log("a");
    if (!(rooms[i].room_id === req.body.room_id)) {
      return res.status(400).send({ error: "Invalid" });
    } else {
      let booking = {
        customer_name: req.body.name,
        date: new Date(req.body.date),
        start: req.body.start,
        end: req.body.end,
        status: "confirmed",
      };
      let result = undefined;
      rooms[i].bookingDetails.forEach((book) => {
        if (
          book.date.getTime() == booking.date.getTime() &&
          book.start === booking.start
        ) {
          result = 0;
          console.log("in booking");
          //  return res.status(400).send({error:"Please select different time slot"})
        } else {
          result = 1;
          rooms[i].bookingDetails.push(booking);
          // return res.status(200).send("Booking confirmed")
        }
      });
      if (result) return res.status(200).send("Booking confirmed");
      else
        return res
          .status(400)
          .send({ error: "Please select different time slot" });
    }
    //let room = rooms.filter(({ room_id }) => req.body.room_id === room_id)[0] || null;
    // res.send({ Data: room });
  }
});

//list customers

app.get("/list-customer", (req, res) => {
  let customer_list = [];

  rooms.forEach((room) => {
    let customer_det = { room_name: room.name };

    room.bookingDetails.forEach((customer) => {
      customer_det.customer_name = customer.customer_name;
      customer_det.date = customer.date;
      customer_det.start = customer.start;
      customer_det.end = customer.end;

      customer_list.push(customer_det);
    });
  });

  res.send(customer_list);
});

//get rooms

app.get("/booked-rooms", (req, res) => {
  console.log("list rooms");
  res.status(200).send(rooms);
});

app.get("/", (req, res) => {
  console.log("server is running successfully");
});

const port = process.env.PORT || 7002;

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
