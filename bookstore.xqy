for $book in doc("bookstore.xml")/bookstore/book
where $book/price > 30
return
  <expensiveBook>
    <title>{ $book/title }</title>
    <price>{ $book/price }</price>
  </expensiveBook>
