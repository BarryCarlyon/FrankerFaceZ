<template lang="html">
	<div class="tw-flex tw-align-items-start">
		<label for="edit_format" class="tw-mg-y-05">
			{{ t('setting.actions.format', 'Format') }}
		</label>

		<div class="tw-full-width">
			<input
				id="edit_format"
				v-model="value.format"
				:placeholder="defaults.format"
				class="tw-border-radius-medium tw-font-size-6 tw-full-width ffz-input tw-pd-x-1 tw-pd-y-05 tw-mg-y-05"
				@input="$emit('input', value)"
			>

			<div class="tw-c-text-alt-2 tw-mg-b-1">
				{{ t('setting.actions.variables', 'Available Variables: {vars}', {vars}) }}
			</div>
		</div>
	</div>
</template>

<script>

export default {
	props: ['value', 'defaults', 'vars'],
}

</script>