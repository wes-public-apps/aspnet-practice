// Wesley Murray

using System.Threading.Tasks;

namespace ReactWebApp.Hubs.Clients{
    public interface IChatClient
    {
        Task RecieveMessage(string user, string message)
;    }
}