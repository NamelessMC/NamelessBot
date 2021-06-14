# NamelessBot
NamelessMC Discord bot

## How do I contribute to the bot?
There are a few ways of contributing to the bot for non developers and for developers. Here are two:
- For non developers: You can head over to [NamelessMC/BotConfiguration](https://github.com/NamelessMC/BotConfiguration) and read the README.md for information on how to contribute there.
  - In that repository, you can add parameters to the `>support` command which is really helpful when it comes to providing support on common problems on the Discord.
- For developers: You can close this repository to your computer and help make the bot better!
  - Note to developers: Please do not add useless commands to the bot that don't even have a reason (or useless commands with a reason.)
  - Be sure to keep the formatting style used elsewhere for example:
Don't do the following:
```
public boolean thisReturnsTrue()
{
    return true;
}
```
We want to see the following format:
```
public boolean thisReturnsTrue() {
    return true;
}
```

## Setting up

To setup the discord bot, first build the bot and head to the directory where its saved. After which you can run the jar. If you run it for the first time, a new file called nameless-bot.properties will be created where you can input to `https://github.com/tesseract-ocr/tessdata/raw/master/eng.traineddata` and download the english training data for Tesseract to allow for image processing and extracting of text from it.