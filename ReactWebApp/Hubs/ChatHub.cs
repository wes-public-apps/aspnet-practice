// Wesley Murray
// 2/21/2021
// This is a hub for the message board

using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ReactWebApp.Hubs
{
    public class ChatHub : Hub
    {
        public async Task NewMessage(long username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
        }
    }
}