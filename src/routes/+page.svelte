<script>
  import { Video, Button } from 'flowbite-svelte';
	import { CirclePlusSolid } from 'flowbite-svelte-icons';
</script>

<div class="bg-gray-900">
  <div class="relative isolate pt-14">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="py-24 sm:py-32 lg:pb-40">
      <div class="mx-auto max-w-8xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">ESI gated access on Discord made easy</h1>
          <p class="mt-6 text-lg leading-8 text-gray-300">Eve Link enables enables your members to authenticate for roles based on Character ID, Corporation ID, Alliance ID, or Faction Warfare Affiliation.</p>
          <p class="mt-6 text-lg leading-8 text-gray-300">No coding or server setup required!</p>
					<ol>
						<li class="mt-8 text-lg leading-8 text-gray-300 text-start font-semibold">1. Invite Eve Link bot to your server.</li>
						<li class="mt-1 text-lg leading-8 text-gray-300 text-start font-semibold">2. Create one or more roles.</li>
						<li class="mt-1 text-lg leading-8 text-gray-300 text-start font-semibold">3. Configure the Link integration for each role.</li>
					</ol>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <Button on:click={() => window.location.assign("https://discord.com/oauth2/authorize?client_id=1155360687774769207&scope=bot&permissions=0")} size="xl"><CirclePlusSolid class="mr-4"/>Add Eve Link to your server!</Button>
          </div>
        </div>
				<div class="mt-10 self-center content-center justify-center flex">
					<Video src="/evelink-demo.mp4" controls trackSrc="evelink-demo.mp4" muted />
				</div>
      </div>
    </div>
  </div>
</div>

