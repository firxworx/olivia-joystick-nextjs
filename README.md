# Olivia HCI (olivia-joystick-nextjs)

_An accessible human-computer-interface for users with disabilities_

## Introduction

Olivia HCI is interactive web application built with TypeScript + React that supports input from a USB Joystick via the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) and the keyboard.

A number of modern browser technologies including the Gamepad API, Text-to-Speech API, WebGL, and video streaming are combined to produce a solution that can assist users with a range of disabilities to interact with a computer.

This project was originally conceived to support goals related to a child with extremely limited physical abilities and various cognitive challenges, however the codebase is easily customizable and widely applicable to a range of potential use-cases.

## User Interface

The application features _Modes_ that are conceptually similar to "apps". Users can switch between different modes and interact with a given mode via a joystick and/or keyboard.

The current-generation hardware prototype features a 4-way arcade-style joystick and two buttons: an _action button_ and a _mode button_. The text-to-speech API is used to announce user interactions and events.

Keyboard navigation parallels the hardware interface: arrow keys represent joystick inputs, the spacebar is the action button, and the shift key cycles between modes.

The [react-spring](https://react-spring.io/) library is used to power transitions and animate user interactions. [Tailwind](https://tailwindcss.com/) is implemented as the component styling solution.

## Modes

### Television Mode

_Television Mode_ cycles through a circular list of YouTube URL's and the action toggles play/pause behaviour.

YouTube URLs are specified in `src/data/episodes.ts` where they can be easily customized. Our project roadmap includes a UI for caregivers to support customizing the episode list.

The embedded YouTube player is powered by [react-player](https://www.npmjs.com/package/react-player), a project that features support for a range of popular video and media-sharing platforms.

### Speech Mode

_Speech Mode_ is a working proof-of-concept that enables users to select a phrase from a list of phrases and have it spoken aloud via the text-to-speech API when they press the action button.

### 3D Modes

_3D Modes_ are in-development prototypes that will serve as the foundation for a wide range of potential educational and entertainment features.

The working prototype modes are powered by [react-three-fiber](https://www.npmjs.com/package/@react-three/fiber) and [threejs](https://www.npmjs.com/package/three). They support a hardware-accelerated 3D WebGL environments that include support for loading GLTF models and the ability to move around.

#### Adding Models

WebGL supports GLTF/GLB format models that can be obtained from sites like [SketchFab.com](https://sketchfab.com).

To compile GLTF's into a compressed binary format:

```sh
npx gltf-pipeline -i model.gltf -o model.glb --draco.compressionLevel=7

# for convenient copy-and-pasting (a lot of auto-converted sketchfab models have the filename 'scene.gltf')
npx gltf-pipeline -i scene.gltf -o model.glb --draco.compressionLevel=7
```

To generate a JSX/TSX component (`-t` flag is for TypeScript):

```sh
npx gltfjsx model.glb -t
```

Note the code will likely need to be customized by hand.

Refer to <https://github.com/pmndrs/gltfjsx> for docs regarding the various features/flags.

## Project History

This project was conceived to enable a "pre-preteen" non-verbal child named Olivia to interact with a computer for the first time. Olivia has severe physical disabilities due to cerebral palsy (spastic quadriplegia) and various cognitive impairments due to a genetic disorder.

Olivia's disabilities are too severe to support the use of any assistive devices that we know of. She has not been successful with devices that range from simple buttons that trigger playback of pre-recorded phrases to advanced assistive technologies such as eye-tracking solutions.

The following observations about Olivia served as a catalyst for this project:

- Limited range-of-motion in dominant hand could theoretically support the crude manipulation of an ideally-positioned joystick
- Simple devices such as buttons that play a phrase are boring and are probably too insufficiently engaging to be effective
- Demonstrations of cognition, memory, etc. appeared to theoretically support at least a basic level of interaction with a machine
- She loves cartoons and has clear favourites including _Dora the Explorer_, _Masha and the Bear_, and _Curious George_.

The initial concept was to create the experience of "changing the channel" for Olivia by enabling her to switch between episodes of her favourite TV shows on her own. It was reasoned that that this capability could prove sufficiently rewarding to engage her and enable further assessments of her potential in terms of physical and mental development.

The prototype has exceeded all stakeholder expectations: Olivia has proven that she can successfully use the device as designed, and she absolutely loves using it.

Our ultimate goal is to enable Olivia to interact and communicate with her caregivers in a more meaningful way.

## Hardware Overview

The hardware interface is comprised of a generic arcade-style joystick, buttons, and a USB controller. It is created with the same hardware that's popular among makers and hobbyists for use in DIY arcade projects such as [RetroPie](https://retropie.org.uk/) cabinets.

The USB controller registers itself as `Generic USB Joystick (Vendor: 0079 Product: 0006)`. This is one of the most popular controllers listed on [gamepad-tester.com](https://gamepad-tester.com/controllers).

All of the components used in this project are easily sourced from Amazon, AliExpress, and similar retailers.

An in-development hardware improvement will mate the "control box" to a cymbal stand so that it can be reliably and securely positioned in the best possible orientation for the user.

## Development and Deployment

This project is created using the [Next.js](https://nextjs.org/) framework for React.

After cloning the project, run the development server via:

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000/olivia-joystick-nextjs](http://localhost:3000/olivia-joystick-nextjs) in your browser.

Deployment can be accomplished by leveraging NextJS' export feature (run: `yarn export` or `npm run export`) to produce a static site that can then be uploaded to almost any web host or run locally from a computer with a modern web browser.

## License

This project is released under the Apache 2.0 License.
