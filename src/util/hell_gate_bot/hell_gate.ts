import { Logger } from "@nestjs/common";

const url = {
    discord: 'https://discord.com'
}

export default class HellGate
{
    async send_message(message: string)
    {
        const response = await fetch(`${url.discord}/api/v8/channels/349824328520695818/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${process.env.TOKEN}`
            },
            body: JSON.stringify({ content: message })
        });

        if (response.status != 200) Logger.log('Attendance failed to sent in discord', 'Discord notify');

        return response;
    }
}