<script>
	import '../app.postcss';
	import { GithubSolid } from 'flowbite-svelte-icons';
</script>

<html class="h-full bg-gray-900" lang="en">
	<body class="h-full">
		<slot />
		<footer class="bg-gray-900">
			<div class="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
				<div class="mt-10 flex justify-center space-x-10">
					<a href="https://github.com/codecorsair/eve-discord-link"><GithubSolid class="text-slate-400 hover:text-slate-300"/></a>
				</div>
				<span class="mt-10 float-left text-xs leading-5 text-gray-500">All <a href="https://www.eveonline.com" class="text-green-500 hover:text-green-400">EVE</a> related materials are property of <a href="https://www.ccpgames.com" class="text-green-500 hover:text-green-400">CCP Games</a></span>
				<span class="mt-10 float-right text-xs leading-5 text-gray-500">Eve Link brought to you by <a href="https://zkillboard.com/character/543923189/" class="text-green-500 hover:text-green-400">Decstroyer</a></span>
			</div>
		</footer>
	</body>
</html>
