# Tailwind CSS Rundown

## Overview
- Tailwind CSS is a css framework focused on flexibility
- It is not a UI kit and does not have default themes


## got hops style rules

### Colors
- primary bg color:       `bg-yellow-300`
- text color on primary:  `text-yellow-800`
- secondary bg color:     `bg-yellow-900`

- border radius:          `rounded-b-lg`


## Playground

- [Test Out The Various Features](https://play.tailwindcss.com/)

## Responsiveness

Understanding Breakpoints
- [Documentation on Responsive Design](https://tailwindcss.com/docs/responsive-design)

## Display

- Tailwind uses the traditional flexbox conventions 
    - (unlike bootstrap, which uses its own `container>row>column` system)
- 

```html
<!-- samples -->
<div>
    <!-- block  -->
  <div class="block">

    <div class="flex"> flex 1
    </div>
    <div class="flex"> flex 2
    </div>

  </div>
</div>
```