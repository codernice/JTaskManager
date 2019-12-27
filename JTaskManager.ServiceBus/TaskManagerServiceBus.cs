using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JTaskManager.ServiceBus
{
    public class TaskManagerServiceBus
    {
        public void Start()
        {
            NLog.LogManager.LoadConfiguration("nlog.config").GetCurrentClassLogger();
            QuartzHelper.InitScheduler();
            QuartzHelper.StartScheduler();
        }

        public void Stop()
        {
            QuartzHelper.StopSchedule();

            System.Environment.Exit(0);
        }
    }
}
