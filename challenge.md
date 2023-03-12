# Context

## Product

WTX is providing truck buyers the best way to find trucks for their needs. To achieve that, as any other marketplace, there's a truck listing page where buyers can search for the trucks they want. This is a typical listing page with filters and pagination.

We now need to make the matching experience a bit more intelligent. For that, the product and engineering team decided to start working on a ranking algorithm. Basically, each truck has a pre-computed ``truck-score`` that is used on the truck listing page. The trucks with higher scores will appear first.

### The current score logic is as follows:
- All scores start at 0
- There are two factors that influence the score, truck location and market price data provided by a data analyst team periodically

##### Location Factor
- If a truck is located on the same city as the buyer, the truck score will increase by 0.5
- If a truck is located in Jordan, because we want to push for Jordan trucks sales, the score increases by 0.5

##### Market price factor
- We sell 3 different types of trucks and the data team is providing the avg market price for each type. If the truck price is lower than the average price for the truck specific type, the score increases by 0.5

##### Some examples
**Truck 1**
- Truck from Jordan (0.5)
- Buyer city is Jordan (0.5)
- Truck price for that type is lower than avg price (0.5)

score: 1.5

**Truck 2**
- Truck from Lisbon (0.0)
- Buyer city is Jordan (0.0)
- Truck price for that type is lower than avg price (0.5)

score: 0.5

**Truck 3**
- Truck from Lisbon (0.0)
- Buyer city is Lisbon (0.5)
- Truck price for that type is higher than avg price (0.0)

score: 0.5

This was the first version and the product team is constantly iterating the score logic. Adding/removing more factors and updating existing factors. Since we had to release this under pressure the ``truck-score`` logic is hard to maintain. 

The code lacks tests, it's not clean nor resilient and lacks readability but more importantly it's not flexible and quite complicated to change, making maintenance quite challenging and not matching business needs.

## Current engineering solution
- The data team provides a CSV file ``truck_type_avg_price.csv`` hosted somewhere (https://bit.ly/avg-price-by-truck-type) that we use for the market price factor logic
- There's one endpoint ``/trucks/score/:id`` that provides all truck information, including the truck score 
- The score is calculated running a *nestjs-command* 
```
// src/truck/truck.command.ts
npx nestjs-command trucks:update
```
- It was also required on all score updates to provide a ``trucks_updated.csv`` file back to the data analysis team. So the solution will also output a csv file to later be provided to the data team.

### API reference

#### Get truck score
> Request: GET http://localhost:3000/trucks/score/3

Response:
```json
  {
   "truck_id":{
      "id": 3,
      "truck_brand": "Volvo",
      "truck_type": 3,
      "price": 2500,
      "location": "Lisbon"
   },
   "score": 0.5
}
```

#### Get truck score w/ user location 
> Request: GET http://localhost:3000/trucks/score/3?location=Lisbon

Response:
```json
  {
   "truck_id":{
      "id": 3,
      "truck_brand": "Volvo",
      "truck_type": 3,
      "price": 2500,
      "location": "Lisbon"
   },
   "score": 1
}
```
## Task

As a senior engineer, we need you to pair program with a junior engineer to refactor the code in a way that it becomes:
- **clean and readable** - self describing
- **testable** - we're not confident making changes to this code. How can we add tests ?
- **reusable** - are there any opportunities of code reuse ?
- **configurable** - what can we leverage from spliting configuration from code ?
- **extendable** - we can easily add/remove factors to the scoring logic
- **observable** - currently it's hard to track and troubleshoot if something goes wrong
- **resilient** - it's a critical component of the product and we're looking for ways to make it more resilient

If we still have time, the product team also wants to have the chance of pushing for Mercedes sales, this means there's a new factor to be considered on the score. Let's implement that logic

- If truck_brand is Mercedes, score logic increases 0.5

#### What we'll be watching
We're mostly looking for a pairing session where we mostly:
- Understand how you think
- Get a sense of how comfortable you are with backend practices
- Check hands on proficiency in Node
- Check overall production experience (how does the code fit a live-live environment and the whole release process)
- Check how you work with others
