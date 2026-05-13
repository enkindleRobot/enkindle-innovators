/**
 * Enkindle Innovators Kit
 * Custom blocks for the Wukong Board
 */
//% color="#E67E22" icon="\uf06d" block="Enkindle"
//% groups='["Line Follower", "Color Sensor", "Sonar Mode"]'
namespace Enkindle {
    let lineFollowActive = false
    let leftPin: DigitalPin = DigitalPin.P8
    let rightPin: DigitalPin = DigitalPin.P12

    // Default speed values initialized to 0
    let speedHigh = 0
    let speedLow = 0

    /**
     * Set the pins for the Left and Right IR sensors.
     */
    //% group="Line Follower"
    //% block="Initialize Line Follower: Left pin %left| Right pin %right"
    //% left.defl=DigitalPin.P8
    //% right.defl=DigitalPin.P12
    //% weight=100
    export function setupPins(left: DigitalPin, right: DigitalPin): void {
        leftPin = left
        rightPin = right
    }

    /**
     * Set the specific motor speeds for line following.
     * @param leftSpeed percentage speed for the left motor, eg: 0
     * @param rightSpeed percentage speed for the right motor, eg: 0
     */
    //% group="Line Follower"
    //% block="set line follow speed to Left Motor %leftSpeed Right Motor %rightSpeed"
    //% leftSpeed.defl=0 rightSpeed.defl=0
    //% weight=95
    export function setLineFollowSpeed(leftSpeed: number, rightSpeed: number): void {
        speedHigh = leftSpeed
        speedLow = rightSpeed
    }

    /**
     * Starts the automatic line following logic.
     */
    //% group="Line Follower"
    //% block="line follow ON"
    //% weight=90
    export function lineFollowOn(): void {
        if (lineFollowActive) return;
        lineFollowActive = true

        control.inBackground(() => {
            while (lineFollowActive) {
                let p8 = pins.digitalReadPin(leftPin)
                let p12 = pins.digitalReadPin(rightPin)

                // P8 (Left) on line, P12 (Right) off line
                if (p8 == 1 && p12 == 0) {
                    wuKong.setMotorSpeed(wuKong.MotorList.M1, speedHigh)
                    wuKong.setMotorSpeed(wuKong.MotorList.M2, speedLow)
                }
                // P8 off line, P12 on line
                else if (p8 == 0 && p12 == 1) {
                    wuKong.setMotorSpeed(wuKong.MotorList.M1, speedLow)
                    wuKong.setMotorSpeed(wuKong.MotorList.M2, speedHigh)
                }
                // Both off line
                else if (p8 == 0 && p12 == 0) {
                    wuKong.setMotorSpeed(wuKong.MotorList.M1, 0)
                    wuKong.setMotorSpeed(wuKong.MotorList.M2, 0)
                }
                // Both on line
                else if (p8 == 1 && p12 == 1) {
                    wuKong.setMotorSpeed(wuKong.MotorList.M1, speedHigh)
                    wuKong.setMotorSpeed(wuKong.MotorList.M2, speedHigh)
                }
                basic.pause(10)
            }
        })
    }

    /**
     * Stops the line following logic and motors.
     */
    //% group="Line Follower"
    //% block="line follow OFF"
    //% weight=80
    export function lineFollowOff(): void {
        lineFollowActive = false
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 0)
        wuKong.setMotorSpeed(wuKong.MotorList.M2, 0)
    }

    /**
     * Line follow for a specific duration in seconds then stop.
     */
    //% group="Line Follower"
    //% block="line follow ON for %seconds|sec"
    //% seconds.defl=5
    //% weight=70
    export function lineFollowOnFor(seconds: number): void {
        lineFollowOn()
        basic.pause(seconds * 1000)
        lineFollowOff()
    }
}