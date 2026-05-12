export const routeOptions = [
  {
    id: 1,
    name: "Fastest Route",
    transport: "Car",
    via: "via A34",
    duration: "35 mins",
    cost: "£4.80",
    co2: "5.2kg CO₂",
    points: "+10",
    co2Saved: "0kg",
    summary:
      "This is the fastest option, but it produces the highest CO₂ emissions.",
    steps: [
      {
        icon: "car",
        title: "Liverpool City Centre",
        detail: "Drive · Start now",
      },
      {
        icon: "car",
        title: "M62 Motorway",
        detail: "Main driving route",
      },
      {
        icon: "pin",
        title: "Manchester City Centre",
        detail: "Arrive in 35 mins",
      },
    ],
  },
  {
    id: 2,
    name: "Greenest Route",
    transport: "Train + Walk",
    via: "via Train + Walk",
    duration: "42 mins",
    cost: "£3.20",
    co2: "1.1kg CO₂",
    points: "+80",
    co2Saved: "4.1kg",
    summary:
      "This route produces the least CO₂ emissions and earns the most points.",
    steps: [
      {
        icon: "train",
        title: "Liverpool Lime Street",
        detail: "Train · 09:15 AM",
      },
      {
        icon: "walk",
        title: "Manchester Oxford Road",
        detail: "Walk · 5 mins",
      },
      {
        icon: "pin",
        title: "Final Destination",
        detail: "Arrive by 09:57 AM",
      },
    ],
  },
  {
    id: 3,
    name: "Cheapest Route",
    transport: "Bus",
    via: "via Bus",
    duration: "50 mins",
    cost: "£2.00",
    co2: "2.0kg CO₂",
    points: "+50",
    co2Saved: "3.2kg",
    summary:
      "This is the cheapest option and still produces much lower emissions than driving.",
    steps: [
      {
        icon: "bus",
        title: "Liverpool ONE Bus Station",
        detail: "Bus · 09:05 AM",
      },
      {
        icon: "bus",
        title: "Manchester Shudehill",
        detail: "Bus arrival stop",
      },
      {
        icon: "pin",
        title: "Final Destination",
        detail: "Arrive in 50 mins",
      },
    ],
  },
];