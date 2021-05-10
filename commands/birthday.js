const { dayLeft } = require("../libraries/common");
const { database } = require("../libraries/database");

module.exports.config = {
  name: "bday",
  description: "Show how many days until your birthday",
  usage: "bday",
};

module.exports.run = async (bot, message, args) => {
  let userId = message.author.id;

  //You can also check someone's birthday
  if (args.length > 0) {
    const mention = message.mentions.users.first();
    if (mention) userId = mention.id;
  }

  const user = database.getUser(userId);
  const bday = user.getBirthday() ? new Date(user.getBirthday()) : undefined;

  //Add time to fix day time zone
  let nextBirthday = new Date(
    new Date().getFullYear(),
    bday.getMonth(),
    bday.getDate(),
    bday.getHours(),
    bday.getMinutes()
  );

  if (dayLeft(nextBirthday) === 0) {
    //Today is your birthday!
    message.react("🎉");
  } else {
    //If your birthday is already passed this year
    if (nextBirthday.getTime() < new Date().getTime()) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    if (userId === message.author.id) {
      message.reply(
        `Keep calm... there are ${dayLeft(nextBirthday)} days until your birthday.`
      );
    } else {
      const mention = message.mentions.users.first();
      message.channel.send(
        `There are only ${dayLeft(nextBirthday)} days until ${mention.username} birthday.`
      );
    }
  }
};
