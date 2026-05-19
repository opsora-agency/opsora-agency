import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FounderForge | Discord Community',
  description: 'Join FounderForge - A community for entrepreneurs, startup enthusiasts, freelancers, creators, and ambitious individuals to learn, connect, and grow together.',
};

const DiscordPage = () => {
  const discordInviteUrl = 'https://discord.gg/EJbCACquF';

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-5xl">
        {/* Horizontal card with rounded corners */}
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col md:flex-row">
          
          {/* Left Side - Discord Profile Header */}
          <div className="relative bg-[#5865F2] px-8 py-12 md:w-2/5 flex flex-col items-center justify-center">
            <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <svg className="w-16 h-16 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495a18.4127 18.4127 0 0 0-5.3959 0c-.1636-.3847-.3973-.8742-.6083-1.2495a.077.077 0 0 0-.0785-.0371 19.7363 19.7363 0 0 0-4.8852 1.5152.0699.0699 0 0 0-.0321.0277C2.5932 7.3026 1.868 10.2023 2.2305 13.059a.0868.0868 0 0 0 .0333.0535c1.6657 1.2229 3.5754 2.1784 5.606 2.7943a.078.078 0 0 0 .0663-.0219c.4313-.5796.814-1.1905 1.1364-1.8326a.0765.0765 0 0 0-.0348-.1041c-.437-.1636-.8533-.363-1.2589-.5992a.0725.0725 0 0 1-.0261-.0977.0729.0729 0 0 1 .0936-.0297c.2732.1499.5406.3132.7999.4909a14.7832 14.7832 0 0 0 8.0163 0c.2595-.1777.527-.3409.8004-.4909a.0727.0727 0 0 1 .0936.0297.0724.0724 0 0 1-.0259.0977c-.4059.2363-.8225.4356-1.2598.5992a.0764.0764 0 0 0-.0345.1039c.3225.642.7053 1.2527 1.1362 1.8323a.077.077 0 0 0 .066.022c2.0309-.616 3.9408-1.5715 5.6065-2.7943a.0865.0865 0 0 0 .033-.0534c.4259-2.3162.2919-5.1726-.6202-7.6609a.07.07 0 0 0-.032-.0276zM8.7015 11.2108c-1.0615 0-1.9278-.968-1.9278-2.1584 0-1.1903.855-2.1584 1.9278-2.1584 1.0727 0 1.939.968 1.9278 2.1584 0 1.1903-.855 2.1584-1.9278 2.1584zm6.5969 0c-1.0615 0-1.9278-.968-1.9278-2.1584 0-1.1903.855-2.1584 1.9278-2.1584 1.0727 0 1.939.968 1.9278 2.1584 0 1.1903-.855 2.1584-1.9278 2.1584z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              FounderForge
            </h2>
            <p className="text-white/90 text-sm font-medium mb-3 text-center">
              ⚒️ Where Founders Rise
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Community Active
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="md:w-3/5 flex flex-col">
            {/* Description */}
            <div className="px-6 pt-8 pb-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  FounderForge is a community built for entrepreneurs, startup enthusiasts, freelancers, creators, students, and ambitious individuals who want to learn, connect, share ideas, and grow together.
                </p>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  The server focuses on meaningful discussions around business, startups, marketing, branding, freelancing, networking, productivity, and personal growth. Whether you are just starting your journey or already building something of your own, FounderForge provides a space to exchange knowledge, gain insights, and connect with like-minded people.
                </p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 italic text-center">
                  FounderForge by Opsora Agency
                </div>
              </div>
            </div>

            {/* Join Button */}
            <div className="px-6 pb-8">
              <Link
                href={discordInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495a18.4127 18.4127 0 0 0-5.3959 0c-.1636-.3847-.3973-.8742-.6083-1.2495a.077.077 0 0 0-.0785-.0371 19.7363 19.7363 0 0 0-4.8852 1.5152.0699.0699 0 0 0-.0321.0277C2.5932 7.3026 1.868 10.2023 2.2305 13.059a.0868.0868 0 0 0 .0333.0535c1.6657 1.2229 3.5754 2.1784 5.606 2.7943a.078.078 0 0 0 .0663-.0219c.4313-.5796.814-1.1905 1.1364-1.8326a.0765.0765 0 0 0-.0348-.1041c-.437-.1636-.8533-.363-1.2589-.5992a.0725.0725 0 0 1-.0261-.0977.0729.0729 0 0 1 .0936-.0297c.2732.1499.5406.3132.7999.4909a14.7832 14.7832 0 0 0 8.0163 0c.2595-.1777.527-.3409.8004-.4909a.0727.0727 0 0 1 .0936.0297.0724.0724 0 0 1-.0259.0977c-.4059.2363-.8225.4356-1.2598.5992a.0764.0764 0 0 0-.0345.1039c.3225.642.7053 1.2527 1.1362 1.8323a.077.077 0 0 0 .066.022c2.0309-.616 3.9408-1.5715 5.6065-2.7943a.0865.0865 0 0 0 .033-.0534c.4259-2.3162.2919-5.1726-.6202-7.6609a.07.07 0 0 0-.032-.0276z"/>
                </svg>
                Join FounderForge on Discord
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
                discord.gg/EJbCACquF
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordPage;
