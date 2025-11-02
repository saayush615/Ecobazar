# Frontend
## Note 1: Tailwind classes patterns
#### Header component

_1. Flexbox Container Pattern_
**When to use**: Parent containers that need horizontal layouts with spacing.
```
flex items-center justify-between gap-4
```
- `flex` - enables flexbox
- `items-center` - vertical alignment
- `justify-between` - spreads items apart (or use justify-center, justify-start)
- `gap-4` - spacing between children (prefer this over margins!)

_2. Responsive Layout Switch:_
**Pattern**: Mobile-first, then override at breakpoints
```
flex flex-col sm:flex-row sm:items-center
```
- Mobile: vertical stack (flex-col)
- Desktop: horizontal row (sm:flex-row)
- Gotcha: Always start with base (mobile), then add sm:, md:, lg: prefixes

_3. Centering & Max-Width Pattern:_
**When to use**: Constraining width while keeping centered
```
max-w-xl mx-auto
```
- `max-w-xl` - maximum width (xs, sm, md, lg, xl, 2xl...)
- `mx-auto` - horizontal margin auto (centers the element)
- Example: Search bars, content containers

_4. Input/Form Field Pattern:_
```
w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500
```
- `w-full` - takes full width of parent
- `border-2 border-{color}` - border width + color
- `rounded-lg` - border radius
- `px-4 py-2.5` - horizontal + vertical padding
- `focus:outline-none` - removes default browser outline
- `focus:border-{color}` - custom focus state

_5. Absolute Positioning with Centering:_
**When to use**: Icons inside inputs, badges on buttons
```
absolute right-3 top-1/2 -translate-y-1/2
```
- `absolute` - takes element out of flow
- `right-3`, `top-1/2` - positioning
- `-translate-y-1/2` - perfect vertical centering trick!
- Parent needs `relative` class

_6. Interactive Button Pattern:_
Reusable for icon buttons:
```
p-2 hover:bg-gray-100 rounded-full transition-colors
```
- `p-2` - padding (makes clickable area larger)
- `hover:bg-{color}` - background on hover
- `rounded-full` - circular shape
- `transition-colors` - smooth color transitions

_7. Responsive Visibility:_
Control what shows at different screen sizes:
```
hidden sm:flex
```
- `hidden` - hide on mobile
- `sm:flex` - show as flex from small screens up
- Alternative: `sm:hidden` (hide on desktop, show on mobile)

_8. Flex Item Control:_
```
flex-1 shrink-0
```
- `flex-1` - grows to fill available space (search bar uses this!)
- `shrink-0` - prevents shrinking (logo uses this!)
- Pattern: Logo (fixed) + Search (grows) + Icons (fixed)

_9. Container Pattern (Most Important for Full-Width Layouts!):_
**When to use**: Almost EVERY major layout section (Header, Hero, Footer, Content areas)
```
container mx-auto px-4
```
Breakdown:
- `container` - Tailwind's special utility that:
    - Sets `max-width` based on breakpoints automatically
    - On mobile: full width
    - On `sm`: max-width: 640px
    - On `md`: max-width: 768px
    - On `lg`: max-width: 1024px
    - On `xl`: max-width: 1280px
    - On `2xl`: max-width: 1536px
- `mx-auto` - Centers the container horizontally
- `px-4` - Adds horizontal padding (prevents content from touching screen edges on mobile)
```jsx
// ❌ BAD - Content touches edges, inconsistent width
<div className="flex items-center">
  {/* Your content */}
</div>

// ✅ GOOD - Professional, responsive, centered layout
<div className="container mx-auto px-4">
  <div className="flex items-center">
    {/* Your content */}
  </div>
</div>
```

#### Navbar
---
## Note 2: Js and Jsx
#### Function call onClick.
- `onClick={myFn}` — call myFn on click (recommended) ✅
- `onClick={() => myFn()}` — call myFn on click (**redundant wrapper**)
- `onClick={() => myFn(arg)}` — pass arg on click (use when necessary) ✅
- `onClick={myFn()}` — BAD: calls immediately during render ❌
- `onClick={(e) => { e.preventDefault(); myFn(); }}` — prevent default then call ✅
- `onClick={(e) => myFn(e, arg)}` — forward event + args ✅
- `onClick={() => setCount(c => c + 1)}` ✅