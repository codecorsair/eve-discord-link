<script lang="ts">
	export let data;
</script>

<div class="p-8">
	<div class="bg-white shadow sm:rounded-lg">
		<div class="px-4 py-5 sm:p-6">
			<h3 class="text-base font-semibold leading-6 text-gray-900">Success!</h3>
			<div class="mt-2 max-w-xl text-sm text-gray-500">
				<p>You have authenticated with the character <strong>{data.character_id}</strong>!</p>
				<br />
				<p>You may now close this window.</p>
			</div>
		</div>
	</div>
</div>
