<script lang="ts">
	import '../app.css';

	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { debounce } from '$lib/utils';

	import { Download } from '@lucide/svelte';
	import QRCodeStyling, { type DotType, type Options } from 'qr-code-styling';
	import { onMount } from 'svelte';

	let container = $state<HTMLElement>();
	let advancedMode = $state(false);

	let text = $state('https://mtzd.pro/');
	let size = $state(512);
	let background = $state('');
	let imageMargin = $state(20);
	let dotType = $state<DotType>('square');
	let dotColor = $state('#4267b2');
	let logo = $state<FileList | undefined>(undefined);
	let cornerDotColor = $state('#0000ff');
	let cornerDotType = $state<DotType>('classy');
	let cornerSquareColor = $state('#0000ff');
	let cornerSquareType = $state<DotType>('rounded');

	let logoData = $derived(logo ? URL.createObjectURL(logo[0]) : undefined);

	const qrCode = new QRCodeStyling({
		width: size,
		height: size,
		type: 'canvas',
		data: text,
		image: logoData,
		dotsOptions: {
			color: dotColor,
			type: dotType
		},
		backgroundOptions: background
			? {
					color: background
				}
			: undefined,
		imageOptions: {
			crossOrigin: 'anonymous',
			margin: imageMargin
		}
	});

	const debouncedUpdate = debounce((data: Partial<Options>) => {
		qrCode.update(data);
	}, 100);

	$effect(() => {
		debouncedUpdate({
			data: text || ':)',
			width: size,
			height: size,
			image: logoData,
			dotsOptions: { color: dotColor, type: dotType },
			cornersDotOptions: {
				color: advancedMode ? cornerDotColor : dotColor,
				type: advancedMode ? cornerDotType : dotType
			},
			cornersSquareOptions: {
				color: advancedMode ? cornerSquareColor : dotColor,
				type: advancedMode ? cornerSquareType : dotType
			},
			backgroundOptions: background
				? {
						color: background
					}
				: undefined,
			imageOptions: {
				crossOrigin: 'anonymous',
				margin: imageMargin
			}
		});
	});

	onMount(() => {
		qrCode.append(container);
	});

	const dotTypeMap = {
		dots: 'Dots',
		rounded: 'Rounded',
		classy: 'Classy',
		'classy-rounded': 'Classy Rounded',
		square: 'Square',
		'extra-rounded': 'Extra Rounded'
	};

	const cornerTypeMap = { ...dotTypeMap, dot: 'Dot' };
</script>

<div class="flex h-dvh w-dvw flex-col">
	<div class="grid w-dvw place-items-center bg-blue-800 p-4">
		<div class="text-2xl font-bold text-white">No BS. Just type your Text/Link/Email</div>

		<div class="mt-4 w-full text-center">
			<Input type="text" class="mx-auto w-full max-w-[512px]" bind:value={text} />
		</div>
	</div>

	<div class="flex h-full w-full">
		<div class="grid h-full w-1/2 place-items-center">
			<div>
				<div bind:this={container} class="bg-white p-4"></div>
				<div class="mt-4 flex w-full justify-center gap-2">
					<Button onclick={() => qrCode.download({ extension: 'svg', name: 'qr-code' })}>
						<Download />
						SVG
					</Button>
					<Button onclick={() => qrCode.download({ extension: 'png', name: 'qr-code' })}>
						<Download />
						PNG
					</Button>
				</div>
			</div>
		</div>

		<div class="grid h-full w-1/2 place-items-center p-4">
			<Card class="p-4">
				<div class="flex flex-col gap-4">
					<div class="mb-4 flex items-center">
						<Switch id="advancedMode" bind:checked={advancedMode} />
						<Label class="ml-2" for="advancedMode">Advanced mode</Label>
					</div>
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="size">Size (px)</Label>
						<Input id="size" type="number" min="10" bind:value={size} />
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="type">Type</Label>

						<Select.Root type="single" bind:value={dotType}>
							<Select.Trigger class="w-[180px]">
								{dotTypeMap[dotType]}
							</Select.Trigger>
							<Select.Content id="type">
								{#each Object.keys(dotTypeMap) as type}
									<Select.Item value={type} label={dotTypeMap[type as DotType]} />
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="logo">Logo</Label>
						<Input id="logo" type="file" bind:files={logo} />
					</div>

					{#if logo}
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="logoMargin">Logo margin</Label>
							<Input id="logoMargin" type="number" min="0" bind:value={imageMargin} />
						</div>
					{/if}

					<div class="grid grid-cols-2 gap-2">
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="color">Color</Label>
							<Input id="color" type="color" bind:value={dotColor} />
						</div>

						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="background">Background</Label>
							<div class="flex gap-2">
								<Input id="background" type="color" bind:value={background} />
								<Button onclick={() => (background = '')}>Transparent</Button>
							</div>
						</div>
					</div>

					{#if advancedMode}
						<div class="flex gap-2">
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="cornerDotType">Corner Dot Type</Label>

								<Select.Root type="single" bind:value={cornerDotType}>
									<Select.Trigger class="w-[180px]">
										{cornerTypeMap[cornerDotType]}
									</Select.Trigger>
									<Select.Content id="cornerDotType">
										{#each Object.keys(cornerTypeMap) as type}
											<Select.Item value={type} label={cornerTypeMap[type as DotType]} />
										{/each}
									</Select.Content>
								</Select.Root>
							</div>

							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="cornerDotColor">Corner Dot Color</Label>
								<Input id="cornerDotColor" type="color" bind:value={cornerDotColor} />
							</div>
						</div>

						<div class="flex gap-2">
							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="cornerSquareType">Corner Square Type</Label>

								<Select.Root type="single" bind:value={cornerSquareType}>
									<Select.Trigger class="w-[180px]">
										{cornerTypeMap[cornerSquareType]}
									</Select.Trigger>
									<Select.Content id="cornerSquareType">
										{#each Object.keys(cornerTypeMap) as type}
											<Select.Item value={type} label={cornerTypeMap[type as DotType]} />
										{/each}
									</Select.Content>
								</Select.Root>
							</div>

							<div class="flex w-full max-w-sm flex-col gap-1.5">
								<Label for="cornerSquareColor">Corner Square Color</Label>
								<Input id="cornerSquareColor" type="color" bind:value={cornerSquareColor} />
							</div>
						</div>
					{/if}
				</div>
			</Card>
		</div>
	</div>
</div>

<style>
	:global(canvas) {
		width: 256px;
	}
</style>
