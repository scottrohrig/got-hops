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

Possible address formatting
```html
      <p translate="no" class="mt-2">
          <!-- use string formatting ? then how to wrap -->
          <span class="street">651B w tower ave</span><br>
          <span class="city">alameda</span>, <abbr title="California" class="region">CA</abbr> <span class="zip">94501</span> <abbr class="Country">USA</abbr>
      </p>
```

Setting Address Info
```html
        <div class="text-yellow-700 text-xs uppercase font-semibold ">
            <a href="tel:+415-553-5425" class="brewery-phone">415-553-5425</a>
              &bull; 
            <a href="http://almanacbeer.com">almanacbeer.com</a> 
        </div>
        <p class="mt-2">
            <!-- use string formatting -->
            <p>651B W Tower Ave</p> 
            <p>Alameda</p> 
            <p>CA</p> 
            <p >34 reviews</p>
        </p>
        
```

```js
var add = {
  street: '651B W Tower Ave',
  city: 'Alameda',
  locality: 'CA',
  country: 'USA'
  zip: '94501'
}

var typeStr = add.type + ' brewery' 
var adStr = `${add.street}, ${add.city}, ${add.locality} ${add.country}`
```
