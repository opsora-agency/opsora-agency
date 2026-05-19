import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discord Community | Opsora Agency',
  description: 'Join our Discord community to connect, collaborate, and grow with Opsora Agency.',
};

const DiscordPage = () => {
  // Discord server invite link
  const discordInviteUrl = 'https://discord.gg/EJbCACquF';

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Centered card with rounded corners */}
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
          {/* Discord Embed Container */}
          <div className="w-full">
            {/* 
              Official Discord Widget Embed
              Using Discord's official widget which displays server profile,
              member count, online users, and an invite button.
              Note: This requires the server to have widget enabled.
              Alternative fallback uses a styled invite card if widget fails.
            */}
            <iframe
              src={`https://discord.com/widget?id=1350274324206190672&theme=dark`}
              className="w-full h-[400px] sm:h-[450px] border-0"
              title="Discord Server Profile"
              allowTransparency={true}
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-forms"
            />
            
            {/* Fallback / Additional Info - Shows invite link iframe fails to load (graceful) */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495a18.4127 18.4127 0 0 0-5.3959 0c-.1636-.3847-.3973-.8742-.6083-1.2495a.077.077 0 0 0-.0785-.0371 19.7363 19.7363 0 0 0-4.8852 1.5152.0699.0699 0 0 0-.0321.0277C2.5932 7.3026 1.868 10.2023 2.2305 13.059a.0868.0868 0 0 0 .0333.0535c1.6657 1.2229 3.5754 2.1784 5.606 2.7943a.078.078 0 0 0 .0663-.0219c.4313-.5796.814-1.1905 1.1364-1.8326a.0765.0765 0 0 0-.0348-.1041c-.437-.1636-.8533-.363-1.2589-.5992a.0725.0725 0 0 1-.0261-.0977.0729.0729 0 0 1 .0936-.0297c.2732.1499.5406.3132.7999.4909a14.7832 14.7832 0 0 0 8.0163 0c.2595-.1777.527-.3409.8004-.4909a.0727.0727 0 0 1 .0936.0297.0724.0724 0 0 1-.0259.0977c-.4059.2363-.8225.4356-1.2598.5992a.0764.0764 0 0 0-.0345.1039c.3225.642.7053 1.2527 1.1362 1.8323a.077.077 0 0 0 .066.022c2.0309-.616 3.9408-1.5715 5.6065-2.7943a.0865.0865 0 0 0 .033-.0534c.4259-2.3162.2919-5.1726-.6202-7.6609a.07.07 0 0 0-.032-.0276zM8.7015 11.2108c-1.0615 0-1.9278-.968-1.9278-2.1584 0-1.1903.855-2.1584 1.9278-2.1584 1.0727 0 1.939.968 1.9278 2.1584 0 1.1903-.855 2.1584-1.9278 2.1584zm6.5969 0c-1.0615 0-1.9278-.968-1.9278-2.1584 0-1.1903.855-2.1584 1.9278-2.1584 1.0727 0 1.939.968 1.9278 2.1584 0 1.1903-.855 2.1584-1.9278 2.1584z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Official Discord Server</span>
                </div>
                <a
                  href={discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495a18.4127 18.4127 0 0 0-5.3959 0c-.1636-.3847-.3973-.8742-.6083-1.2495a.077.077 0 0 0-.0785-.0371 19.7363 19.7363 0 0 0-4.8852 1.5152.0699.0699 0 0 0-.0321.0277C2.5932 7.3026 1.868 10.2023 2.2305 13.059a.0868.0868 0 0 0 .0333.0535c1.6657 1.2229 3.5754 2.1784 5.606 2.7943a.078.078 0 0 0 .0663-.0219c.4313-.5796.814-1.1905 1.1364-1.8326a.0765.0765 0 0 0-.0348-.1041c-.437-.1636-.8533-.363-1.2589-.5992a.0725.0725 0 0 1-.0261-.0977.0729.0729 0 0 1 .0936-.0297c.2732.1499.5406.3132.7999.4909a14.7832 14.7832 0 0 0 8.0163 0c.2595-.1777.527-.3409.8004-.4909a.0727.0727 0 0 1 .0936.0297.0724.0724 0 0 1-.0259.0977c-.4059.2363-.8225.4356-1.2598.5992a.0764.0764 0 0 0-.0345.1039c.3225.642.7053 1.2527 1.1362 1.8323a.077.077 0 0 0 .066.022c2.0309-.616 3.9408-1.5715 5.6065-2.7943a.0865.0865 0 0 0 .033-.0534c.4259-2.3162.2919-5.1726-.6202-7.6609a.07.07 0 0 0-.032-.0276zM8.7015 11.2108c-1.0615 0-1.9278-.968-1.9278-2.1584 0-1.1903.855-2.1584 1.9278-2.1584 1.0727 0 1.939.968 1.9278 2.1584 0 1.1903-.855 2.1584-1.9278 2.1584zm6.5969 0c-1.0615 0-1.9278-.968-1.9278-2.1584 0-1.1903.855-2.1584 1.9278-2.1584 1.0727 0 1.939.968 1.9278 2.1584 0 1.1903-.855 2.1584-1.9278 2.1584z"/>
                  </svg>
                  Join Discord Server
                </a>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Connect with the community • Get updates • Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscordPage;
