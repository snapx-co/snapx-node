import { Duration, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';
import { claimUptimeReward, getScrapingStats, NodeAppStats } from '../api/user';
import { UPTIME_UPDATE_INTERVAL_IN_MS } from '../constants';
import { useTwitterLoggedIn } from '../stores/app-store';

export function ScrapingEarnings() {
	const [stats, setStats] = useState<NodeAppStats| null>({
		todayEarnings: 0,
		totalEarnings: 0,
		totalUptime: 0,
		todayUptime: 0
	})

	const twitterLoggedIn = useTwitterLoggedIn();


	useEffect(() => {
		(async () => {
			const res = await getScrapingStats();
			if(!res) {
				return;
			}
			setStats(res);
		})()
	}, []);

	useEffect(() => {
		if(!twitterLoggedIn) {
			return;
		}
		const unsub = setInterval(() => {
			(async () => {

				const res = await claimUptimeReward(UPTIME_UPDATE_INTERVAL_IN_MS);
				setStats(res);
			})()
		}, UPTIME_UPDATE_INTERVAL_IN_MS);


		return () => clearInterval(unsub);
	}, [twitterLoggedIn]);


	const appUptimeDuration = intervalToDuration({
		start: 0,
		end: stats.totalUptime * 1000,
	});
	const sessionUptimeDuration = intervalToDuration({
		start: 0,
		end: stats.todayUptime * 1000,
	});

	function formatDuration(duration: Duration) {
		return `${duration.days || 0} Days, ${duration.hours || 0} Hrs, ${duration.minutes || 0} Mins`;
	}

	return (
		<div className="flex items-center flex-col">
			<h1 className="text-base-lg text-hint self-start">Social Mining</h1>
			<div className="bg-card py-6 px-5 rounded-xlg mt-2 w-full">
				<p className="text-base-lg">Total Earnings</p>
				<div className="mt-2 bg-secondary py-1 rounded-xlg">
					<p className="font-bold text-3.5xl text-center">
						+ {stats.totalEarnings.toFixed(2)} SP
					</p>
				</div>
				<p className="text-xs-l text-hint mt-1">
					Uptime: {formatDuration(appUptimeDuration)}
				</p>

				<p className="text-base-lg mt-6">Today's Earnings</p>
				<div className="mt-2 bg-secondary py-1 rounded-xlg">
					<p className="font-bold text-3.5xl text-center">
						+ {stats.todayEarnings.toFixed(2)} SP
					</p>
				</div>
				<p className="text-xs-l text-hint mt-1">
					Uptime: {formatDuration(sessionUptimeDuration)}
				</p>
			</div>
		</div>
	);
}
