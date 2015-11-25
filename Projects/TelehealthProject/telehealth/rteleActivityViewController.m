//
//  rteleActivityViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleActivityViewController.h"

@interface rteleActivityViewController ()

@end

@implementation rteleActivityViewController
@synthesize bgview;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
	if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}

@end
