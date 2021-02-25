// Wesley Murray
// 2/21/2021
// This is a hub for the message board

using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using ReactWebApp.Hubs.Clients;

namespace ReactWebApp.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(string username, string message)
        {
            Console.WriteLine("Message Sent "+username+" "+message);
            await Clients.All.RecieveMessage(username, message);
        }
    }
}