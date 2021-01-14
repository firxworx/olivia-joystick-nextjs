# Accessible Interface (React + Gamepad API + USB Joystick)

This repo contains the foundation of an interactive browser-based UI built with React + TypeScript that accepts input from a Generic USB Joystick via the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API).

The goal of this project is to enable a non-verbal child with severe physical disabilities (due to cerebral palsy) and various cognitive impairments (related to a genetic disorder) to interact with a computer for the first time. The idea is to introduce the interface by enabling the user to "change the channel" between favourite TV shows and play various sounds.

If successful, more sophisticated interactions will be implemented that are tailored to the child's abilities, ideally enabling a basic level of communication with caregivers.

The child's parents have tried various assistive technologies such as eye-tracking solutions that have not been successful. The child's various disabilities and lack of fine motor control also prevent the effective use of more traditional HCI devices such as mice, touch pads, and touch screens.

This project makes use of the following modern browser API's:

- Gamepad API
- SpeechSynthesis API
- ..._(more to come)_ ...

These API's are newer and less frequently implemented, especially in the context of a React project, so this code may be helpful to others working on a project that's "off the beaten path".

The project was developed with Chrome/Chromium in mind but it should be supported by any modern web browser.

## Hardware

The physical interface to this project is comprised of a generic arcade-style joystick, a button, and a USB controller. This is the same hardware that's popular among makers and hobbyists for use in DIY arcade projects such as [RetroPie](https://retropie.org.uk/) cabinets.

The USB controller registers itself as `Generic USB Joystick (Vendor: 0079 Product: 0006)`. This is one of the most popular controllers listed on [gamepad-tester.com](https://gamepad-tester.com/controllers).

All of the hardware components used in this project can be easily sourced from Amazon, AliExpress, and similar sites. Options include kits that include one or two joysticks plus all necessary buttons, controllers, and wiring with pre-installed connectors. Arcade-style cases and panels are also available if you do not wish to build your own solution to mount the hardware.

Current plans are to mount a small arcade-style panel on an adjustable stand + mount that supports positioning the joystick within the child's limited range-of-motion. The concept is to leverage drum/percussion hardware for this task because it is infinitely positionable and customizable. It is also suitable for reasons of portability, ruggedness, and affordability vs. niche accessibility products.

The "brain" of the project is an Intel-powered [UP Board](https://up-board.org/) SBC (Single Board Computer) that I inherited from a past client project. I was working on the development of a next-generation vending kiosk with a large touch screen and my client ultimately selected a more powerful board, leaving me with this spare. The UP Board is relatively powerful, affordable, and is powered by a 5V supply. It features HDMI output and 4x USB ports that can support the joystick and a USB soundcard.

The UP Board will run linux configured to boot into a full-screen [https://www.chromium.org/](chromium) browser running in `--kiosk` mode.

If you have other ideas or contributions to this project, please share them: <hello@firxworx.com>!

## Development and Deployment

This project is created using the [Next.js](https://nextjs.org/) framework for React.

After cloning the project, run the development server via:

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Deployment can be accomplished by leveraging NextJS' export feature (`next export`) to produce a static site that can then be loaded onto the production hardware.
