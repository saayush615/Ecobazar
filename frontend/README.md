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

#### Navbar component - Collapsible Menu Pattern

_10. Desktop Navigation Menu Pattern:_
**When to use**: Navigation with dropdown submenus
```jsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Category</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className='flex flex-col p-2 min-w-[200px]'>
          <NavigationMenuLink href="/category/vegetable" className='px-4 py-2 hover:bg-gray-200 rounded'>
            Vegetable
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```
- `NavigationMenu` - Shadcn wrapper for accessible navigation
- `NavigationMenuTrigger` - Dropdown activator (auto handles aria attributes)
- `NavigationMenuContent` - Hidden content that appears on hover/click
- `min-w-[200px]` - Sets minimum dropdown width
- Pattern: Trigger → Content → Links with consistent hover states

_11. Mobile Sheet Menu Pattern:_
**When to use**: Slide-in mobile menus (hamburger navigation)
```jsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Trigger Button
<button onClick={() => setIsMobileMenuOpen(true)}>
  <Menu className='w-5 h-5' />
</button>

// Sheet Component
<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    <div className='flex flex-col gap-2 mt-6'>
      <a onClick={() => setIsMobileMenuOpen(false)}>Link</a>
    </div>
  </SheetContent>
</Sheet>
```
- `Sheet` - Shadcn's drawer/modal component
- `open` + `onOpenChange` - Controlled component pattern (required!)
- `side="left"` - Slide direction (left, right, top, bottom)
- `w-[300px] sm:w-[400px]` - Responsive width (custom values)
- **Always close sheet** on link click: `onClick={() => setIsMobileMenuOpen(false)}`

_12. Responsive Menu Toggle Pattern:_
**When to use**: Show mobile menu below breakpoint, desktop menu above
```jsx
{/* Mobile Button */}
<div className='block min-[520px]:hidden'>
  <button onClick={() => setIsMobileMenuOpen(true)}>Menu</button>
</div>

{/* Desktop Menu */}
<div className='hidden min-[520px]:block'>
  <NavigationMenu>...</NavigationMenu>
</div>
```
- `block` + `hidden` - Base visibility states
- `min-[520px]:hidden` - Hide on screens ≥520px (custom breakpoint!)
- `min-[520px]:block` - Show on screens ≥520px
- Pattern: Both exist in DOM, CSS controls visibility

_13. Mobile Menu Sections Pattern:_
**When to use**: Grouping related links in mobile drawer
```jsx
<div className='px-4 py-3'>
  <h3 className='font-semibold text-gray-900 mb-2'>Category</h3>
  <div className='flex flex-col gap-1 ml-4'>
    <a href="/link" className='py-2 hover:text-green-600 transition-colors'>
      Link Text
    </a>
  </div>
</div>
```
- `px-4 py-3` - Section container padding
- `ml-4` - Indent child links for hierarchy
- `gap-1` - Tight vertical spacing for links
- `hover:text-{color}` - Color change on hover (not background!)
- Pattern: Section title → Indented links with consistent spacing

**Key Gotchas:**
- ❌ Don't forget `onOpenChange` on Sheet - needed for backdrop close
- ❌ Don't use `onClick={fn()}` - calls immediately! Use `onClick={fn}` or `onClick={() => fn()}`
- ✅ Always close mobile menu on navigation: `onClick={() => setIsMobileMenuOpen(false)}`
- ✅ Custom breakpoints use `min-[value]:class` syntax (e.g., `min-[520px]:block`)

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