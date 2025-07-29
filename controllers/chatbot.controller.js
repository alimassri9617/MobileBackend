const buildingInfo = {
  campus: "Antonine University - Zahle",

  floors: {
    ground: [
      { name: "Secretary's office", location: "left of main entrance" },
      { name: "Church", location: "right of main entrance" },
      { name: "Principal's office", location: "behind the staircase" },
      { name: "Admission office", location: "next to Principal's office" },
      { name: "Theatre", location: "next to the cafeteria" },
      { name: "Cafeteria", location: "next to the Theatre" },
    ],
    first: [
      { name: "Robotics Lab", room: "100" },
      { name: "Amphitheatre", room: "104" },
      { name: "Office of Student Affairs", room: "110" },
      { name: "Office of Management", room: "106" },
    ],
    second: [
      { name: "IT department", room: "203" },
      { name: "Library", room: "204" },
      { name: "Mirna Achkouty's office", room: "207" },
      { name: "Learning Lab", room: "210" },
      { name: "Cuisine", room: "200" },
      { name: "Cisco Lab", room: "201" },
    ],
    third: [
      { name: "Electronics Lab", room: "304" },
      { name: "School of Music", room: "303" },
      { name: "Multimedia Lab", room: "301" },
      { name: "Telecom Lab", room: "300" },
    ],
  },

  staff: [
    {
      name: "Anthony Tannoury",
      credentials: "PhD",
      title: "Dean’s Delegate",
      phone: "+961 8 902020",
      email: "anthony.tannoury@ua.edu.lb"
    },
    {
      name: "Michel Tannoury",
      title: "Senior Lecturer",
      phone: "+961 8 902020 - 30 - 40 ext. 4111",
      email: "michel.tannoury@ua.edu.lb"
    },
    {
      name: "Mirna Achkouty",
      title: "Administrative Assistant",
      phone: "+961 8 902020",
      email: "mirna.achkouty@ua.edu.lb"
    },
    {
      name: "Faculty of Engineering and Technology",
      title: "",
      phone: "+961 8 902020",
      email: "assistant.foe@ua.edu.lb"
    },
    {
      name: "Chady Abou Jaoude",
      credentials: "PhD",
      title: "Associate Professor, Dean",
      phone: "+961 5 927000 ext. 2100",
      email: "chady.aboujaoude@ua.edu.lb"
    },
    {
      name: "Kabalan Chaccour",
      credentials: "PhD",
      title: "Head of the Department of Computer and Communications Engineering",
      phone: "+961 5 927000 ext. 2122",
      email: "kabalan.chaccour@ua.edu.lb"
    },
    {
      name: "Charbel El Gemayel",
      credentials: "PhD",
      title: "Head of the Department of Technology in Computer Science",
      phone: "N/A",
      email: "charbel.gemayel@ua.edu.lb"
    }
  ]
};

// Build a natural-language staff directory for the prompt
const staffDirectory = buildingInfo.staff.map(
  ({ name, credentials, title, phone, email }) => {
    const cred = credentials ? `, ${credentials}` : "";
    return `${name}${cred} is the ${title}. You can reach them at ${phone}${email ? ` or email at ${email}` : ""}.`;
  }
).join("\n");

// Compose the campus description with embedded staffDirectory
buildingInfo.description = `Antonine Zahle Campus Overview: On the ground floor, upon entering the main entrance, the Secretary's office is located to the left, while the Church is to the right. The Principal's office is situated behind the staircase, and the Admission office is next to it. The Theatre and Cafeteria share the ground floor, adjacent to each other.

On the first floor: Robotics Lab (100), Amphitheatre (104), Office of Student Affairs (110), Office of Management (106).

On the second floor: IT department (203), Library (204), Mirna Achkouty's office (207), Learning Lab (210), Cuisine (200), Cisco Lab (201).

On the third floor: Electronics Lab (304), School of Music (303), Multimedia Lab (301), Telecom Lab (300).

Building B: Houses the Business, Physiotherapy, and Dental Lab departments (detailed layouts coming soon).

Staff Directory:
${staffDirectory}`;

export const getBuildingInfo = async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
You are a helpful assistant for Antonine Zahle Campus. Answer questions about locations, facilities, and staff strictly based on the information provided below.

Campus Information:
${buildingInfo.description}

Question: ${question}

Guidelines:
1. Be concise and specific.
2. Include floor and room number when available.
3. If location is described, maintain that context.
4. If the question is about staff, respond in natural language (e.g., "X is the Y"), including their contact details.
5. If you don't know the answer, just say "I don't have information about that location or person."
6. For location questions, mention the floor first.
7. Do not use markdown formatting or bullet symbols (such as asterisks).

`;

    const headers = {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    };

    if (process.env.SITE_URL) headers["HTTP-Referer"] = process.env.SITE_URL;
    if (process.env.SITE_NAME) headers["X-Title"] = process.env.SITE_NAME;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          { role: "system", content: "You are a helpful assistant that provides information about Antonine Zahle Campus." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return res.status(500).json({ error: `OpenRouter API request failed with status ${response.status}` });
    }

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get campus information" });
  }
};

export const getFloors = (req, res) => {
  res.json({ floors: Object.keys(buildingInfo.floors) });
};

export const getFloorDetails = (req, res) => {
  const { floor } = req.params;
  if (buildingInfo.floors[floor]) {
    res.json({ floor, details: buildingInfo.floors[floor] });
  } else {
    res.status(404).json({ error: "Floor not found" });
  }
};

export const getStaffList = (req, res) => {
  res.json({ staff: buildingInfo.staff });
};
